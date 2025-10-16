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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      action_items: {
        Row: {
          analysis_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          section: string
          step_index: number
          step_text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          section: string
          step_index: number
          step_text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          section?: string
          step_index?: number
          step_text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      analyses: {
        Row: {
          analytical_check: string | null
          answers_id: string | null
          assistant_id: string | null
          confidence_level: number | null
          created_at: string
          def_gravity: string | null
          def_power: string | null
          def_risk: string | null
          diagnosis_primary: string | null
          diagnosis_secondary: string | null
          diagnosis_tertiary: string | null
          diagnostic_so_what: string | null
          diagnostic_state: string | null
          email: string
          error_json: Json | null
          gravity_definition: string | null
          gravity_expl: string | null
          gravity_explanation: string | null
          gravity_score: number | null
          id: string
          immediate_move: string | null
          input_querytext: string | null
          input_text: string
          is_ready: boolean
          issue_category: string | null
          issue_confidence_pct: string | null
          issue_layer: string | null
          issue_type: string | null
          job_id: string | null
          long_term_fix: string | null
          narrative_summary: string | null
          power_definition: string | null
          power_expl: string | null
          power_explanation: string | null
          power_score: number | null
          processing_completed_at: string | null
          processing_started_at: string | null
          psychological_profile: Json | null
          query_id: string | null
          radar_confidence: number | null
          radar_control: number | null
          radar_gravity: number | null
          radar_red_1: string | null
          radar_red_2: string | null
          radar_red_3: string | null
          radar_stability: number | null
          radar_strategy: number | null
          references_external: string | null
          references_internal: string | null
          risk_definition: string | null
          risk_expl: string | null
          risk_explanation: string | null
          risk_score: number | null
          run_id: string | null
          snapshot: string | null
          status: string
          strategic_tool: string | null
          summary: string | null
          tactical_moves: string | null
          thread_id: string | null
          tl_dr: string | null
          updated_at: string
          user_id: string
          vector_store_id: string | null
          whats_happening: string | null
          why_it_matters: string | null
        }
        Insert: {
          analytical_check?: string | null
          answers_id?: string | null
          assistant_id?: string | null
          confidence_level?: number | null
          created_at?: string
          def_gravity?: string | null
          def_power?: string | null
          def_risk?: string | null
          diagnosis_primary?: string | null
          diagnosis_secondary?: string | null
          diagnosis_tertiary?: string | null
          diagnostic_so_what?: string | null
          diagnostic_state?: string | null
          email: string
          error_json?: Json | null
          gravity_definition?: string | null
          gravity_expl?: string | null
          gravity_explanation?: string | null
          gravity_score?: number | null
          id?: string
          immediate_move?: string | null
          input_querytext?: string | null
          input_text: string
          is_ready?: boolean
          issue_category?: string | null
          issue_confidence_pct?: string | null
          issue_layer?: string | null
          issue_type?: string | null
          job_id?: string | null
          long_term_fix?: string | null
          narrative_summary?: string | null
          power_definition?: string | null
          power_expl?: string | null
          power_explanation?: string | null
          power_score?: number | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          psychological_profile?: Json | null
          query_id?: string | null
          radar_confidence?: number | null
          radar_control?: number | null
          radar_gravity?: number | null
          radar_red_1?: string | null
          radar_red_2?: string | null
          radar_red_3?: string | null
          radar_stability?: number | null
          radar_strategy?: number | null
          references_external?: string | null
          references_internal?: string | null
          risk_definition?: string | null
          risk_expl?: string | null
          risk_explanation?: string | null
          risk_score?: number | null
          run_id?: string | null
          snapshot?: string | null
          status?: string
          strategic_tool?: string | null
          summary?: string | null
          tactical_moves?: string | null
          thread_id?: string | null
          tl_dr?: string | null
          updated_at?: string
          user_id: string
          vector_store_id?: string | null
          whats_happening?: string | null
          why_it_matters?: string | null
        }
        Update: {
          analytical_check?: string | null
          answers_id?: string | null
          assistant_id?: string | null
          confidence_level?: number | null
          created_at?: string
          def_gravity?: string | null
          def_power?: string | null
          def_risk?: string | null
          diagnosis_primary?: string | null
          diagnosis_secondary?: string | null
          diagnosis_tertiary?: string | null
          diagnostic_so_what?: string | null
          diagnostic_state?: string | null
          email?: string
          error_json?: Json | null
          gravity_definition?: string | null
          gravity_expl?: string | null
          gravity_explanation?: string | null
          gravity_score?: number | null
          id?: string
          immediate_move?: string | null
          input_querytext?: string | null
          input_text?: string
          is_ready?: boolean
          issue_category?: string | null
          issue_confidence_pct?: string | null
          issue_layer?: string | null
          issue_type?: string | null
          job_id?: string | null
          long_term_fix?: string | null
          narrative_summary?: string | null
          power_definition?: string | null
          power_expl?: string | null
          power_explanation?: string | null
          power_score?: number | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          psychological_profile?: Json | null
          query_id?: string | null
          radar_confidence?: number | null
          radar_control?: number | null
          radar_gravity?: number | null
          radar_red_1?: string | null
          radar_red_2?: string | null
          radar_red_3?: string | null
          radar_stability?: number | null
          radar_strategy?: number | null
          references_external?: string | null
          references_internal?: string | null
          risk_definition?: string | null
          risk_expl?: string | null
          risk_explanation?: string | null
          risk_score?: number | null
          run_id?: string | null
          snapshot?: string | null
          status?: string
          strategic_tool?: string | null
          summary?: string | null
          tactical_moves?: string | null
          thread_id?: string | null
          tl_dr?: string | null
          updated_at?: string
          user_id?: string
          vector_store_id?: string | null
          whats_happening?: string | null
          why_it_matters?: string | null
        }
        Relationships: []
      }
      analyses_old: {
        Row: {
          analytical_check: string | null
          answers_id: string
          chart_type: string | null
          confidence_level: number | null
          created_at: string | null
          def_gravity: string | null
          def_power: string | null
          def_risk: string | null
          deleted_at: string | null
          diagnostic_so_what: string | null
          diagnostic_state: string | null
          email: string
          gravity_explanation: string | null
          gravity_score: number | null
          id: string
          immediate_move: string | null
          input_text: string
          is_ready: boolean | null
          issue_category: string | null
          issue_layer: string | null
          issue_type: string | null
          job_id: string
          long_term_fix: string | null
          metadata: Json | null
          narrative_summary: string | null
          openai_model: string | null
          openai_tokens_used: number | null
          power_explanation: string | null
          power_score: number | null
          processed_at: string | null
          processing_duration_ms: number | null
          query_id: string
          radar_confidence: number | null
          radar_control: number | null
          radar_gravity: number | null
          radar_power: number | null
          radar_stability: number | null
          radar_strategy: number | null
          references_external: string[] | null
          references_internal: string | null
          risk_explanation: string | null
          risk_score: number | null
          snapshot: string | null
          status: string
          strategic_tool: string | null
          submission_id: string | null
          summary: string | null
          title: string | null
          tl_dr: string | null
          updated_at: string | null
          user_id: string
          whats_happening: string | null
          why_it_matters: string | null
        }
        Insert: {
          analytical_check?: string | null
          answers_id: string
          chart_type?: string | null
          confidence_level?: number | null
          created_at?: string | null
          def_gravity?: string | null
          def_power?: string | null
          def_risk?: string | null
          deleted_at?: string | null
          diagnostic_so_what?: string | null
          diagnostic_state?: string | null
          email: string
          gravity_explanation?: string | null
          gravity_score?: number | null
          id?: string
          immediate_move?: string | null
          input_text: string
          is_ready?: boolean | null
          issue_category?: string | null
          issue_layer?: string | null
          issue_type?: string | null
          job_id: string
          long_term_fix?: string | null
          metadata?: Json | null
          narrative_summary?: string | null
          openai_model?: string | null
          openai_tokens_used?: number | null
          power_explanation?: string | null
          power_score?: number | null
          processed_at?: string | null
          processing_duration_ms?: number | null
          query_id: string
          radar_confidence?: number | null
          radar_control?: number | null
          radar_gravity?: number | null
          radar_power?: number | null
          radar_stability?: number | null
          radar_strategy?: number | null
          references_external?: string[] | null
          references_internal?: string | null
          risk_explanation?: string | null
          risk_score?: number | null
          snapshot?: string | null
          status?: string
          strategic_tool?: string | null
          submission_id?: string | null
          summary?: string | null
          title?: string | null
          tl_dr?: string | null
          updated_at?: string | null
          user_id: string
          whats_happening?: string | null
          why_it_matters?: string | null
        }
        Update: {
          analytical_check?: string | null
          answers_id?: string
          chart_type?: string | null
          confidence_level?: number | null
          created_at?: string | null
          def_gravity?: string | null
          def_power?: string | null
          def_risk?: string | null
          deleted_at?: string | null
          diagnostic_so_what?: string | null
          diagnostic_state?: string | null
          email?: string
          gravity_explanation?: string | null
          gravity_score?: number | null
          id?: string
          immediate_move?: string | null
          input_text?: string
          is_ready?: boolean | null
          issue_category?: string | null
          issue_layer?: string | null
          issue_type?: string | null
          job_id?: string
          long_term_fix?: string | null
          metadata?: Json | null
          narrative_summary?: string | null
          openai_model?: string | null
          openai_tokens_used?: number | null
          power_explanation?: string | null
          power_score?: number | null
          processed_at?: string | null
          processing_duration_ms?: number | null
          query_id?: string
          radar_confidence?: number | null
          radar_control?: number | null
          radar_gravity?: number | null
          radar_power?: number | null
          radar_stability?: number | null
          radar_strategy?: number | null
          references_external?: string[] | null
          references_internal?: string | null
          risk_explanation?: string | null
          risk_score?: number | null
          snapshot?: string | null
          status?: string
          strategic_tool?: string | null
          submission_id?: string | null
          summary?: string | null
          title?: string | null
          tl_dr?: string | null
          updated_at?: string | null
          user_id?: string
          whats_happening?: string | null
          why_it_matters?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          analysis_id: string | null
          created_at: string | null
          email: string | null
          error_message: string | null
          event_data: Json | null
          event_name: string
          event_type: string
          id: string
          ip_address: unknown | null
          job_id: string | null
          metadata: Json | null
          query_id: string | null
          request_id: string | null
          status: string | null
          submission_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string | null
          email?: string | null
          error_message?: string | null
          event_data?: Json | null
          event_name: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          job_id?: string | null
          metadata?: Json | null
          query_id?: string | null
          request_id?: string | null
          status?: string | null
          submission_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_id?: string | null
          created_at?: string | null
          email?: string | null
          error_message?: string | null
          event_data?: Json | null
          event_name?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          job_id?: string | null
          metadata?: Json | null
          query_id?: string | null
          request_id?: string | null
          status?: string | null
          submission_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses_old"
            referencedColumns: ["id"]
          },
        ]
      }
      kv_store_9398f716: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      landing_screenshots: {
        Row: {
          created_at: string | null
          description: string
          display_order: number
          id: number
          image_url: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order: number
          id?: number
          image_url: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number
          id?: number
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          plan_name: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          plan_name: string
          plan_type: string
          status: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          plan_name?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      screenshots: {
        Row: {
          created_at: string | null
          description: string
          display_order: number
          id: number
          image_url: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order: number
          id?: number
          image_url: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number
          id?: number
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          analysis_id: string
          answers_id: string | null
          created_at: string
          email: string
          id: string
          input_querytext: string | null
          job_id: string | null
          payment_plan: string | null
          query_id: string | null
          session_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_id: string
          answers_id?: string | null
          created_at?: string
          email: string
          id?: string
          input_querytext?: string | null
          job_id?: string | null
          payment_plan?: string | null
          query_id?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_id?: string
          answers_id?: string | null
          created_at?: string
          email?: string
          id?: string
          input_querytext?: string | null
          job_id?: string | null
          payment_plan?: string | null
          query_id?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          last_login_at: string | null
          payment_plan: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          last_login_at?: string | null
          payment_plan?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          last_login_at?: string | null
          payment_plan?: string
          updated_at?: string
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
