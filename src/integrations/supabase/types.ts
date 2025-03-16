export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string
          entry_fee: number
          icon: string
          id: string
          min_players: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          entry_fee?: number
          icon: string
          id?: string
          min_players?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          entry_fee?: number
          icon?: string
          id?: string
          min_players?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_players: {
        Row: {
          created_at: string
          game_id: string
          id: string
          player_id: string
          score: number
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          player_id: string
          score?: number
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          player_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          category_id: string
          created_at: string
          end_time: string | null
          id: string
          start_time: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      player_answers: {
        Row: {
          created_at: string
          game_id: string
          id: string
          is_correct: boolean
          player_id: string
          points: number
          question_id: string
          selected_answer: number
          time_to_answer: number
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          is_correct: boolean
          player_id: string
          points?: number
          question_id: string
          selected_answer: number
          time_to_answer: number
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          is_correct?: boolean
          player_id?: string
          points?: number
          question_id?: string
          selected_answer?: number
          time_to_answer?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_answers_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_answers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          balance: number
          created_at: string
          email: string
          id: string
          is_admin: boolean
          phone_number: string | null
          updated_at: string
          username: string
        }
        Insert: {
          balance?: number
          created_at?: string
          email: string
          id: string
          is_admin?: boolean
          phone_number?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          balance?: number
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean
          phone_number?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category_id: string
          correct_answer: number
          created_at: string
          difficulty: string
          id: string
          options: Json
          text: string
          time_limit: number
          updated_at: string
        }
        Insert: {
          category_id: string
          correct_answer: number
          created_at?: string
          difficulty?: string
          id?: string
          options: Json
          text: string
          time_limit?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          correct_answer?: number
          created_at?: string
          difficulty?: string
          id?: string
          options?: Json
          text?: string
          time_limit?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          bonus_amount: number
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          bonus_amount?: number
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          bonus_amount?: number
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_oy5xf_answers: {
        Row: {
          answered_at: string
          id: number
          is_correct: boolean
          points_earned: number
          question_id: number | null
          selected_answer: number
          session_id: number | null
          time_taken: number
          user_email: string
        }
        Insert: {
          answered_at?: string
          id?: number
          is_correct: boolean
          points_earned: number
          question_id?: number | null
          selected_answer: number
          session_id?: number | null
          time_taken: number
          user_email: string
        }
        Update: {
          answered_at?: string
          id?: number
          is_correct?: boolean
          points_earned?: number
          question_id?: number | null
          selected_answer?: number
          session_id?: number | null
          time_taken?: number
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "trivia_oy5xf_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "trivia_oy5xf_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trivia_oy5xf_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "trivia_oy5xf_game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_oy5xf_categories: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      trivia_oy5xf_game_sessions: {
        Row: {
          category_id: number | null
          completed_at: string | null
          correct_answers: number | null
          id: number
          questions_answered: number | null
          started_at: string
          status: string | null
          total_score: number | null
          user_email: string
        }
        Insert: {
          category_id?: number | null
          completed_at?: string | null
          correct_answers?: number | null
          id?: number
          questions_answered?: number | null
          started_at?: string
          status?: string | null
          total_score?: number | null
          user_email: string
        }
        Update: {
          category_id?: number | null
          completed_at?: string | null
          correct_answers?: number | null
          id?: number
          questions_answered?: number | null
          started_at?: string
          status?: string | null
          total_score?: number | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "trivia_oy5xf_game_sessions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "trivia_oy5xf_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_oy5xf_questions: {
        Row: {
          category_id: number | null
          correct_answer: number
          created_at: string
          created_by: string
          id: number
          options: string[]
          points: number | null
          question: string
          time_limit: number | null
        }
        Insert: {
          category_id?: number | null
          correct_answer: number
          created_at?: string
          created_by: string
          id?: number
          options: string[]
          points?: number | null
          question: string
          time_limit?: number | null
        }
        Update: {
          category_id?: number | null
          correct_answer?: number
          created_at?: string
          created_by?: string
          id?: number
          options?: string[]
          points?: number | null
          question?: string
          time_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trivia_oy5xf_questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "trivia_oy5xf_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      users_trivia_oy5xf_profiles: {
        Row: {
          created_at: string
          credits: number | null
          display_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string
          user_email: string
        }
        Insert: {
          created_at?: string
          credits?: number | null
          display_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string
          user_email: string
        }
        Update: {
          created_at?: string
          credits?: number | null
          display_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string
          user_email?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
