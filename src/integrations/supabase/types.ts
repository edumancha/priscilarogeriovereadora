export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          device_id: string | null
          id: string
          ip_address: unknown
          item_id: string | null
          item_type: Database["public"]["Enums"]["item_type"] | null
          metadata: Json | null
          profile_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: unknown
          item_id?: string | null
          item_type?: Database["public"]["Enums"]["item_type"] | null
          metadata?: Json | null
          profile_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: unknown
          item_id?: string | null
          item_type?: Database["public"]["Enums"]["item_type"] | null
          metadata?: Json | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_name: string | null
          content: string
          created_at: string
          device_id: string | null
          id: string
          is_anonymous: boolean | null
          is_approved: boolean | null
          item_id: string
          item_type: Database["public"]["Enums"]["item_type"]
          profile_id: string | null
        }
        Insert: {
          author_name?: string | null
          content: string
          created_at?: string
          device_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          item_id: string
          item_type: Database["public"]["Enums"]["item_type"]
          profile_id?: string | null
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string
          device_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          item_id?: string
          item_type?: Database["public"]["Enums"]["item_type"]
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          created_at: string
          device_fingerprint: string
          id: string
          last_suggestion_at: string | null
          last_vote_at: string | null
          suggestion_count: number | null
          vote_count: number | null
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          id?: string
          last_suggestion_at?: string | null
          last_vote_at?: string | null
          suggestion_count?: number | null
          vote_count?: number | null
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          id?: string
          last_suggestion_at?: string | null
          last_vote_at?: string | null
          suggestion_count?: number | null
          vote_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_moderator: boolean | null
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_moderator?: boolean | null
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_moderator?: boolean | null
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          area: string | null
          category: Database["public"]["Enums"]["category_type"]
          comments_count: number | null
          created_at: string
          description: string
          id: string
          is_published: boolean | null
          title: string
          updated_at: string
          votes_down: number | null
          votes_up: number | null
        }
        Insert: {
          area?: string | null
          category: Database["public"]["Enums"]["category_type"]
          comments_count?: number | null
          created_at?: string
          description: string
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Update: {
          area?: string | null
          category?: Database["public"]["Enums"]["category_type"]
          comments_count?: number | null
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          internal_notes: string | null
          location: string | null
          neighborhood: string | null
          priority: Database["public"]["Enums"]["report_priority"]
          reporter_contact: string
          reporter_name: string
          status: Database["public"]["Enums"]["report_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          internal_notes?: string | null
          location?: string | null
          neighborhood?: string | null
          priority?: Database["public"]["Enums"]["report_priority"]
          reporter_contact: string
          reporter_name: string
          status?: Database["public"]["Enums"]["report_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          internal_notes?: string | null
          location?: string | null
          neighborhood?: string | null
          priority?: Database["public"]["Enums"]["report_priority"]
          reporter_contact?: string
          reporter_name?: string
          status?: Database["public"]["Enums"]["report_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          author_name: string | null
          category: Database["public"]["Enums"]["category_type"]
          comments_count: number | null
          created_at: string
          description: string
          device_id: string | null
          id: string
          is_anonymous: boolean | null
          is_approved: boolean | null
          neighborhood: string | null
          profile_id: string | null
          title: string
          updated_at: string
          votes_down: number | null
          votes_up: number | null
        }
        Insert: {
          author_name?: string | null
          category: Database["public"]["Enums"]["category_type"]
          comments_count?: number | null
          created_at?: string
          description: string
          device_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          neighborhood?: string | null
          profile_id?: string | null
          title: string
          updated_at?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Update: {
          author_name?: string | null
          category?: Database["public"]["Enums"]["category_type"]
          comments_count?: number | null
          created_at?: string
          description?: string
          device_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          neighborhood?: string | null
          profile_id?: string | null
          title?: string
          updated_at?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          ip_address: unknown
          item_id: string
          item_type: Database["public"]["Enums"]["item_type"]
          profile_id: string | null
          vote: Database["public"]["Enums"]["vote_type"]
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: unknown
          item_id: string
          item_type: Database["public"]["Enums"]["item_type"]
          profile_id?: string | null
          vote: Database["public"]["Enums"]["vote_type"]
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: unknown
          item_id?: string
          item_type?: Database["public"]["Enums"]["item_type"]
          profile_id?: string | null
          vote?: Database["public"]["Enums"]["vote_type"]
        }
        Relationships: [
          {
            foreignKeyName: "votes_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_moderator: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      category_type:
        | "infraestrutura"
        | "saude"
        | "educacao"
        | "seguranca"
        | "social"
        | "meio_ambiente"
        | "cultura"
        | "transporte"
      item_type: "project" | "suggestion"
      report_priority: "low" | "medium" | "high" | "urgent"
      report_status: "pending" | "in_review" | "resolved" | "archived"
      vote_type: "up" | "down"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      category_type: [
        "infraestrutura",
        "saude",
        "educacao",
        "seguranca",
        "social",
        "meio_ambiente",
        "cultura",
        "transporte",
      ],
      item_type: ["project", "suggestion"],
      report_priority: ["low", "medium", "high", "urgent"],
      report_status: ["pending", "in_review", "resolved", "archived"],
      vote_type: ["up", "down"],
    },
  },
} as const
