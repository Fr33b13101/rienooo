export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
      }
      user_entries: {
        Row: {
          id: string
          amount: number
          date: string | null
          category_id: string | null
          user_id: string | null
          note: string | null
          created_at: string | null
          description: string | null
        }
        Insert: {
          id?: string
          amount: number
          date?: string | null
          category_id?: string | null
          user_id?: string | null
          note?: string | null
          created_at?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          amount?: number
          date?: string | null
          category_id?: string | null
          user_id?: string | null
          note?: string | null
          created_at?: string | null
          description?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          name: string
          amount: number
          reason: string
          date: string
          due_date: string
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type?: string
          name: string
          amount: number
          reason: string
          date: string
          due_date: string
          status?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          name?: string
          amount?: number
          reason?: string
          date?: string
          due_date?: string
          status?: string
          created_at?: string | null
        }
      }
      entries: {
        Row: {
          id: string
          date: string
          product_or_service: string
          revenue: number
          cost: number
          category_id: string | null
          notes: string | null
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          date: string
          product_or_service: string
          revenue?: number
          cost?: number
          category_id?: string | null
          notes?: string | null
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          date?: string
          product_or_service?: string
          revenue?: number
          cost?: number
          category_id?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string | null
        }
      }
      debts_credits: {
        Row: {
          id: string
          name: string
          amount: number
          reason: string
          date: string
          due_date: string
          status: string
          type: string
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          amount: number
          reason: string
          date: string
          due_date: string
          status: string
          type: string
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          amount?: number
          reason?: string
          date?: string
          due_date?: string
          status?: string
          type?: string
          user_id?: string
          created_at?: string | null
        }
      }
      users_information: {
        Row: {
          id: string
          firstname: string
          lastname: string
          email: string
          created_at: string | null
          currency: string | null
        }
        Insert: {
          id: string
          firstname: string
          lastname: string
          email: string
          created_at?: string | null
          currency?: string | null
        }
        Update: {
          id?: string
          firstname?: string
          lastname?: string
          email?: string
          created_at?: string | null
          currency?: string | null
        }
      }
      daily_streaks: {
        Row: {
          id: string
          user_id: string
          date: string
          current_streak: number
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          current_streak?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          current_streak?: number
          created_at?: string | null
        }
      }
      collaborators: {
        Row: {
          id: string
          user_id: string
          collaborator_email: string
          role: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          collaborator_email: string
          role: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          collaborator_email?: string
          role?: string
          created_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          created_at?: string | null
        }
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
  }
}