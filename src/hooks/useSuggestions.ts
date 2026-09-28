import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  neighborhood?: string;
  author_name?: string;
  is_anonymous: boolean;
  votes_up: number;
  votes_down: number;
  comments_count: number;
  created_at: string;
  status?: string | null;
  admin_response?: string | null;
}

export interface CreateSuggestionInput {
  title: string;
  description: string;
  category: string;
  neighborhood?: string;
  author_name?: string;
  is_anonymous: boolean;
}

export function useSuggestions() {
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: async (): Promise<Suggestion[]> => {
      const { data, error } = await supabase
        .from("suggestions")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Suggestion[];
    },
  });
}

export function useCreateSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSuggestionInput) => {
      const deviceFingerprint = getDeviceFingerprint();
      
      const response = await supabase.functions.invoke("submit-suggestion", {
        body: input,
        headers: {
          "x-device-fingerprint": deviceFingerprint,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao enviar sugestão");
      }

      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemType,
      itemId,
      vote,
    }: {
      itemType: "project" | "suggestion";
      itemId: string;
      vote: "up" | "down";
    }) => {
      const deviceFingerprint = getDeviceFingerprint();
      
      const response = await supabase.functions.invoke("submit-vote", {
        body: {
          item_type: itemType,
          item_id: itemId,
          vote,
        },
        headers: {
          "x-device-fingerprint": deviceFingerprint,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao votar");
      }

      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [variables.itemType === "project" ? "projects" : "suggestions"] 
      });
    },
  });
}
