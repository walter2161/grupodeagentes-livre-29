export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_interactions: {
        Row: {
          agent_id: string
          created_at: string
          data: Json | null
          id: string
          interaction_type: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          data?: Json | null
          id?: string
          interaction_type: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          data?: Json | null
          id?: string
          interaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_memory: {
        Row: {
          agent_id: string
          conversation_history: Json | null
          created_at: string
          id: string
          last_interaction: string | null
          personal_notes: string | null
          preferences: Json | null
          user_id: string
        }
        Insert: {
          agent_id: string
          conversation_history?: Json | null
          created_at?: string
          id?: string
          last_interaction?: string | null
          personal_notes?: string | null
          preferences?: Json | null
          user_id: string
        }
        Update: {
          agent_id?: string
          conversation_history?: Json | null
          created_at?: string
          id?: string
          last_interaction?: string | null
          personal_notes?: string | null
          preferences?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          agent_id: string
          approach: string
          avatar: string | null
          color: string
          created_at: string
          description: string
          documentation: string
          experience: string
          guidelines: string
          icon: string
          id: string
          is_active: boolean | null
          name: string
          persona_style: string
          specialty: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          approach: string
          avatar?: string | null
          color: string
          created_at?: string
          description: string
          documentation: string
          experience: string
          guidelines: string
          icon: string
          id?: string
          is_active?: boolean | null
          name: string
          persona_style: string
          specialty: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          approach?: string
          avatar?: string | null
          color?: string
          created_at?: string
          description?: string
          documentation?: string
          experience?: string
          guidelines?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          persona_style?: string
          specialty?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          agent_id: string | null
          created_at: string
          date_time: string
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          date_time: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          date_time?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          agent_id: string
          audio_url: string | null
          content: string
          created_at: string
          id: string
          message_id: string
          sender: string
          user_id: string
        }
        Insert: {
          agent_id: string
          audio_url?: string | null
          content: string
          created_at?: string
          id?: string
          message_id: string
          sender: string
          user_id: string
        }
        Update: {
          agent_id?: string
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          message_id?: string
          sender?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_protocols: {
        Row: {
          agent_id: string | null
          created_at: string
          description: string
          id: string
          steps: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          description: string
          id?: string
          steps?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          description?: string
          id?: string
          steps?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_disclaimers: {
        Row: {
          acknowledged: boolean | null
          created_at: string
          date: string
          id: string
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          created_at?: string
          date: string
          id?: string
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          created_at?: string
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      group_messages: {
        Row: {
          agent_id: string | null
          content: string
          created_at: string
          group_id: string
          id: string
          is_response: boolean | null
          mentions: string[] | null
          message_id: string
          responding_to: string | null
          sender: string
          sender_avatar: string | null
          sender_name: string | null
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          content: string
          created_at?: string
          group_id: string
          id?: string
          is_response?: boolean | null
          mentions?: string[] | null
          message_id: string
          responding_to?: string | null
          sender: string
          sender_avatar?: string | null
          sender_name?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string | null
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          is_response?: boolean | null
          mentions?: string[] | null
          message_id?: string
          responding_to?: string | null
          sender?: string
          sender_avatar?: string | null
          sender_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          color: string
          created_at: string
          created_by: string | null
          description: string
          group_id: string
          icon: string
          id: string
          is_default: boolean | null
          members: string[]
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          created_by?: string | null
          description: string
          group_id: string
          icon: string
          id?: string
          is_default?: boolean | null
          members: string[]
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string | null
          description?: string
          group_id?: string
          icon?: string
          id?: string
          is_default?: boolean | null
          members?: string[]
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guidelines: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          email: string
          id: string
          name: string
          preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      virtual_rooms: {
        Row: {
          agent_id: string
          created_at: string
          environment: string
          id: string
          last_activity: string | null
          memories: Json | null
          room_id: string
          room_name: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          environment: string
          id?: string
          last_activity?: string | null
          memories?: Json | null
          room_id: string
          room_name: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          environment?: string
          id?: string
          last_activity?: string | null
          memories?: Json | null
          room_id?: string
          room_name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
