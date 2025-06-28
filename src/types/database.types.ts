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
      categories: {
        Row: {
          id: string
          name: string
          type: 'income' | 'expense'
          color: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'income' | 'expense'
          color?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'income' | 'expense'
          color?: string | null
          user_id?: string
          created_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          date: string
          product_or_service: string
          revenue: number
          cost: number
          category_id: string
          notes: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          product_or_service: string
          revenue: number
          cost: number
          category_id: string
          notes?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          product_or_service?: string
          revenue?: number
          cost?: number
          category_id?: string
          notes?: string | null
          user_id?: string
          created_at?: string
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
          status: 'paid' | 'unpaid'
          type: 'receivable' | 'payable'
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          amount: number
          reason: string
          date: string
          due_date: string
          status: 'paid' | 'unpaid'
          type: 'receivable' | 'payable'
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          amount?: number
          reason?: string
          date?: string
          due_date?: string
          status?: 'paid' | 'unpaid'
          type?: 'receivable' | 'payable'
          user_id?: string
          created_at?: string
        }
      }
      daily_streaks: {
        Row: {
          id: string
          user_id: string
          date: string
          current_streak: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          current_streak: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          current_streak?: number
          created_at?: string
        }
      }
      collaborators: {
        Row: {
          id: string
          user_id: string
          collaborator_email: string
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          collaborator_email: string
          role: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          collaborator_email?: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
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