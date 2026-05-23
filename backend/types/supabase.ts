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
          display_name: string | null;
          avatar_url: string | null;
          level: number;
          total_xp: number;
          current_streak: number;
          best_streak: number;
          plan_type: "free" | "premium";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          total_xp?: number;
          current_streak?: number;
          best_streak?: number;
          plan_type?: "free" | "premium";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          total_xp?: number;
          current_streak?: number;
          best_streak?: number;
          plan_type?: "free" | "premium";
          created_at?: string;
          updated_at?: string;
        };
      };

      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          mode: "pomodoro" | "short_break" | "long_break" | "deep_work" | "custom";
          duration_minutes: number;
          completed: boolean;
          xp_earned: number;
          started_at: string;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mode: "pomodoro" | "short_break" | "long_break" | "deep_work" | "custom";
          duration_minutes: number;
          completed?: boolean;
          xp_earned?: number;
          started_at: string;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mode?: "pomodoro" | "short_break" | "long_break" | "deep_work" | "custom";
          duration_minutes?: number;
          completed?: boolean;
          xp_earned?: number;
          started_at?: string;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      mood_logs: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          mood_id: "anxious" | "bored" | "neutral" | "productive" | "focused";
          log_type: "pre_session" | "post_session" | "doom_loop_pause";
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id?: string | null;
          mood_id: "anxious" | "bored" | "neutral" | "productive" | "focused";
          log_type: "pre_session" | "post_session" | "doom_loop_pause";
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string | null;
          mood_id?: "anxious" | "bored" | "neutral" | "productive" | "focused";
          log_type?: "pre_session" | "post_session" | "doom_loop_pause";
          timestamp?: string;
          created_at?: string;
        };
      };

      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          log_date: string;
          app_id: string;
          category: string;
          minutes_used: number;
          opens_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_date: string;
          app_id: string;
          category: string;
          minutes_used?: number;
          opens_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          log_date?: string;
          app_id?: string;
          category?: string;
          minutes_used?: number;
          opens_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      leisure_bank_state: {
        Row: {
          user_id: string;
          total_earned_minutes: number;
          total_spent_minutes: number;
          last_reset_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_earned_minutes?: number;
          total_spent_minutes?: number;
          last_reset_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          total_earned_minutes?: number;
          total_spent_minutes?: number;
          last_reset_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          insight_text: string;
          type: "post_session" | "weekly_report";
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          insight_text: string;
          type: "post_session" | "weekly_report";
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          insight_text?: string;
          type?: "post_session" | "weekly_report";
          read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      plan_type: "free" | "premium";
      session_mode: "pomodoro" | "short_break" | "long_break" | "deep_work" | "custom";
      mood_id: "anxious" | "bored" | "neutral" | "productive" | "focused";
      log_type: "pre_session" | "post_session" | "doom_loop_pause";
      insight_type: "post_session" | "weekly_report";
    };
  };
}
