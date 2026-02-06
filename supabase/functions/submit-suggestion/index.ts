import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-fingerprint',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { title, description, category, neighborhood, author_name, is_anonymous } = await req.json();
    
    // Get device fingerprint from header
    const deviceFingerprint = req.headers.get('x-device-fingerprint') || 'unknown';
    
    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';

    // Validate required fields
    if (!title || !description || !category) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios não preenchidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check or create device record
    let { data: device } = await supabase
      .from('devices')
      .select('*')
      .eq('device_fingerprint', deviceFingerprint)
      .single();

    if (!device) {
      // Create new device record
      const { data: newDevice, error: deviceError } = await supabase
        .from('devices')
        .insert({ device_fingerprint: deviceFingerprint })
        .select()
        .single();
      
      if (deviceError) {
        console.error('Device creation error:', deviceError);
        return new Response(
          JSON.stringify({ error: 'Erro ao registrar dispositivo' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      device = newDevice;
    }

    // Check rate limit: 1 suggestion per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    if (device.last_suggestion_at && device.last_suggestion_at > tenMinutesAgo) {
      const waitTime = Math.ceil((new Date(device.last_suggestion_at).getTime() + 10 * 60 * 1000 - Date.now()) / 60000);
      return new Response(
        JSON.stringify({ 
          error: `Aguarde ${waitTime} minuto(s) antes de enviar outra sugestão`,
          rate_limited: true,
          wait_minutes: waitTime
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
        }
      }
    }

    // Insert suggestion
    const { data: suggestion, error: suggestionError } = await supabase
      .from('suggestions')
      .insert({
        title,
        description,
        category,
        neighborhood: neighborhood || null,
        author_name: is_anonymous ? null : (author_name || null),
        is_anonymous: is_anonymous ?? true,
        profile_id: profileId,
        device_id: device.id,
      })
      .select()
      .single();

    if (suggestionError) {
      console.error('Suggestion error:', suggestionError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar sugestão' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update device last suggestion timestamp
    await supabase
      .from('devices')
      .update({ 
        last_suggestion_at: new Date().toISOString(),
        suggestion_count: (device.suggestion_count || 0) + 1
      })
      .eq('id', device.id);

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        action: 'create_suggestion',
        item_type: 'suggestion',
        item_id: suggestion.id,
        profile_id: profileId,
        device_id: device.id,
        ip_address: clientIP,
        metadata: { category, is_anonymous }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        suggestion,
        message: 'Sugestão enviada com sucesso!' 
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
