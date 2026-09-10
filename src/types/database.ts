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
          connected_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id?: string | null;
          status?: "pending" | "connected";
          connected_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string | null;
          status?: "pending" | "connected";
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
