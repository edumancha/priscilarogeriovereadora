import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  area?: string;
  votes_up: number;
  votes_down: number;
  comments_count: number;
  created_at: string;
  status?: "rascunho" | "andamento" | "concluido";
  order_index?: number;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .neq("status", "rascunho")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Project[];
    },
  });
}
