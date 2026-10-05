export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          partner_id: string | null;
          invite_code: string | null;
          relationship_type: string | null;
          push_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          partner_id?: string | null;
          invite_code?: string | null;
          relationship_type?: string | null;
          push_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          partner_id?: string | null;
          invite_code?: string | null;
          relationship_type?: string | null;
          push_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      couples: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string | null;
          status: "pending" | "connected";
          relationship_type: string | null;
          connected_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id?: string | null;
          status?: "pending" | "connected";
          relationship_type?: string | null;
          connected_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string | null;
          status?: "pending" | "connected";
          relationship_type?: string | null;
          connected_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "couples_user1_id_fkey";
            columns: ["user1_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "couples_user2_id_fkey";
            columns: ["user2_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_sparks: {
        Row: {
          id: string;
          question: string;
          spark_date: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          spark_date?: string;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          spark_date?: string;
          category?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      spark_answers: {
        Row: {
          id: string;
          spark_id: string;
          user_id: string;
          answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          spark_id: string;
          user_id: string;
          answer: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          spark_id?: string;
          user_id?: string;
          answer?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "spark_answers_spark_id_fkey";
            columns: ["spark_id"];
            isOneToOne: false;
            referencedRelation: "daily_sparks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "spark_answers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      date_ideas: {
        Row: {
          id: string;
          title: string;
          category: string;
          category_color: string | null;
          description: string;
          location: string | null;
          website_url: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          category_color?: string | null;
          description: string;
          location?: string | null;
          website_url?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          category_color?: string | null;
          description?: string;
          location?: string | null;
          website_url?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "date_ideas_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      memories: {
        Row: {
          id: string;
          couple_id: string;
          user_id: string;
          image_url: string;
          caption: string | null;
          memory_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          user_id: string;
          image_url: string;
          caption?: string | null;
          memory_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          user_id?: string;
          image_url?: string;
          caption?: string | null;
          memory_date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memories_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memories_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      quiz_sessions: {
        Row: {
          id: string;
          answerer_id: string;
          reviewer_id: string;
          question_ids: Json;
          status: "awaiting_review" | "completed";
          score: number | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          answerer_id: string;
          reviewer_id: string;
          question_ids: Json;
          status?: "awaiting_review" | "completed";
          score?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          answerer_id?: string;
          reviewer_id?: string;
          question_ids?: Json;
          status?: "awaiting_review" | "completed";
          score?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_answerer_id_fkey";
            columns: ["answerer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_sessions_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      quiz_answers: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          guessed_option: string;
          is_correct: boolean | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_id: string;
          guessed_option: string;
          is_correct?: boolean | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          question_id?: string;
          guessed_option?: string;
          is_correct?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_answers_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "quiz_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      secret_crush_messages: {
        Row: {
          id: string;
          sender_id: string;
          message: string;
          status: "sent" | "opened" | "replied";
          reply_message: string | null;
          opened_at: string | null;
          replied_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          message: string;
          status?: "sent" | "opened" | "replied";
          reply_message?: string | null;
          opened_at?: string | null;
          replied_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          message?: string;
          status?: "sent" | "opened" | "replied";
          reply_message?: string | null;
          opened_at?: string | null;
          replied_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "secret_crush_messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      couple_challenge_progress: {
        Row: {
          id: string;
          couple_key: string;
          user_a_id: string;
          user_b_id: string;
          current_day: number;
          completed_days: Json;
          last_completed_at: string | null;
          started_at: string;
        };
        Insert: {
          id?: string;
          couple_key: string;
          user_a_id: string;
          user_b_id: string;
          current_day?: number;
          completed_days?: Json;
          last_completed_at?: string | null;
          started_at?: string;
        };
        Update: {
          id?: string;
          couple_key?: string;
          user_a_id?: string;
          user_b_id?: string;
          current_day?: number;
          completed_days?: Json;
          last_completed_at?: string | null;
          started_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "couple_challenge_progress_user_a_id_fkey";
            columns: ["user_a_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "couple_challenge_progress_user_b_id_fkey";
            columns: ["user_b_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      couple_challenge_completions: {
        Row: {
          id: string;
          progress_id: string;
          user_id: string;
          day: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          progress_id: string;
          user_id: string;
          day: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          progress_id?: string;
          user_id?: string;
          day?: number;
          completed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "couple_challenge_completions_progress_id_fkey";
            columns: ["progress_id"];
            isOneToOne: false;
            referencedRelation: "couple_challenge_progress";
            referencedColumns: ["id"];
          },
        ];
      };
      twenty_one_questions_sessions: {
        Row: {
          id: string;
          couple_key: string;
          question_ids: Json;
          created_at: string;
          reset_at: string | null;
        };
        Insert: {
          id?: string;
          couple_key: string;
          question_ids?: Json;
          created_at?: string;
          reset_at?: string | null;
        };
        Update: {
          id?: string;
          couple_key?: string;
          question_ids?: Json;
          created_at?: string;
          reset_at?: string | null;
        };
        Relationships: [];
      };
      twenty_one_questions_answers: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          question_id: string;
          answer: string;
          answered_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          question_id: string;
          answer: string;
          answered_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          question_id?: string;
          answer?: string;
          answered_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "twenty_one_questions_answers_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "twenty_one_questions_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          id: string;
          couple_key: string;
          sender_id: string;
          content: string;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          couple_key: string;
          sender_id: string;
          content: string;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          couple_key?: string;
          sender_id?: string;
          content?: string;
          created_at?: string;
          read_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
