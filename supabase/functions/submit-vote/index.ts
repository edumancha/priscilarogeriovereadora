import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-fingerprint',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { item_type, item_id, vote } = await req.json();
    
    const deviceFingerprint = req.headers.get('x-device-fingerprint') || 'unknown';
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';

    // Validate
    if (!item_type || !item_id || !vote) {
      return new Response(
        JSON.stringify({ error: 'Dados inválidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['project', 'suggestion'].includes(item_type) || !['up', 'down'].includes(vote)) {
      return new Response(
        JSON.stringify({ error: 'Tipo de item ou voto inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create device
    let { data: device } = await supabase
      .from('devices')
      .select('*')
      .eq('device_fingerprint', deviceFingerprint)
      .single();

    if (!device) {
      const { data: newDevice } = await supabase
        .from('devices')
        .insert({ device_fingerprint: deviceFingerprint })
        .select()
        .single();
      device = newDevice;
    }

    // Rate limit: 1 vote per item per device, but can change vote
    // Check existing vote from this device for this item
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('item_type', item_type)
      .eq('item_id', item_id)
      .eq('device_id', device.id)
      .single();

    // Check for authenticated user
    const authHeader = req.headers.get('Authorization');
    let profileId = null;
    
    if (authHeader) {
      const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
        global: { headers: { Authorization: authHeader } }
      });
      
      const { data: { user } } = await supabaseAuth.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          profileId = profile.id;
          
          // Also check if user already voted
          const { data: userVote } = await supabase
            .from('votes')
            .select('*')
            .eq('item_type', item_type)
            .eq('item_id', item_id)
            .eq('profile_id', profile.id)
            .single();
          
          if (userVote && !existingVote) {
            return new Response(
              JSON.stringify({ error: 'Você já votou neste item' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      }
    }

    let voteChange = { up: 0, down: 0 };
    
    if (existingVote) {
      if (existingVote.vote === vote) {
        // Same vote - remove it (toggle off)
        await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);
        
        voteChange[vote as 'up' | 'down'] = -1;
      } else {
        // Different vote - update it
        await supabase
          .from('votes')
          .update({ vote, ip_address: clientIP })
          .eq('id', existingVote.id);
        
        voteChange[existingVote.vote as 'up' | 'down'] = -1;
        voteChange[vote as 'up' | 'down'] = 1;
      }
    } else {
      // New vote
      await supabase
        .from('votes')
        .insert({
          item_type,
          item_id,
          vote,
          profile_id: profileId,
          device_id: device.id,
          ip_address: clientIP,
        });
      
      voteChange[vote as 'up' | 'down'] = 1;
    }

    // Update vote counts on the item
    const table = item_type === 'project' ? 'projects' : 'suggestions';
    const { data: item } = await supabase
      .from(table)
      .select('votes_up, votes_down')
      .eq('id', item_id)
      .single();

    if (item) {
      await supabase
        .from(table)
        .update({
          votes_up: Math.max(0, (item.votes_up || 0) + voteChange.up),
          votes_down: Math.max(0, (item.votes_down || 0) + voteChange.down),
        })
        .eq('id', item_id);
    }

    // Update device stats
    await supabase
      .from('devices')
      .update({ 
        last_vote_at: new Date().toISOString(),
        vote_count: (device.vote_count || 0) + 1
      })
      .eq('id', device.id);

    // Get updated counts
    const { data: updatedItem } = await supabase
      .from(table)
      .select('votes_up, votes_down')
      .eq('id', item_id)
      .single();

    return new Response(
      JSON.stringify({ 
        success: true,
        votes_up: updatedItem?.votes_up || 0,
        votes_down: updatedItem?.votes_down || 0,
        user_vote: existingVote?.vote === vote ? null : vote
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Vote error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao processar voto' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
