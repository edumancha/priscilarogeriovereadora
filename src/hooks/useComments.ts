import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Comment {
  id: string;
  content: string;
  author_name: string | null;
  is_anonymous: boolean | null;
  created_at: string;
}

export type ItemType = "project" | "suggestion";

export function useComments(itemType: ItemType, itemId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["comments", itemType, itemId],
    enabled,
    queryFn: async (): Promise<Comment[]> => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, content, author_name, is_anonymous, created_at")
        .eq("item_type", itemType)
        .eq("item_id", itemId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Comment[];
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemType,
      itemId,
      content,
      authorName,
    }: {
      itemType: ItemType;
      itemId: string;
      content: string;
      authorName?: string;
    }) => {
      const trimmed = content.trim();
      if (trimmed.length < 3) throw new Error("Comentário muito curto");
      if (trimmed.length > 1000) throw new Error("Comentário muito longo (máx. 1000 caracteres)");

      const name = authorName?.trim();
      const { error } = await supabase.from("comments").insert({
        item_type: itemType,
        item_id: itemId,
        content: trimmed,
        author_name: name ? name.slice(0, 80) : null,
        is_anonymous: !name,
      });

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.itemType, variables.itemId] });
      queryClient.invalidateQueries({
        queryKey: [variables.itemType === "project" ? "projects" : "suggestions"],
      });
    },
  });
}
