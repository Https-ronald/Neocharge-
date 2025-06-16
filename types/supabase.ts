export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          name: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          name: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          name?: string
          role?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string
          password_hash: string
          first_name: string
          last_name: string
          phone: string | null
          role: string
          dark_mode: boolean
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          password_hash: string
          first_name: string
          last_name: string
          phone?: string | null
          role: string
          dark_mode: boolean
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          password_hash?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: string
          dark_mode?: boolean
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          created_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          created_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          expires_at?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          description: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          description: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          description?: string
          status?: string
          created_at?: string
        }
      }
      service_plans: {
        Row: {
          id: string
          plan_id: string
          provider_id: string
          name: string
          description: string
          amount: number
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          provider_id: string
          name: string
          description: string
          amount: number
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          provider_id?: string
          name?: string
          description?: string
          amount?: number
          type?: string
          created_at?: string
        }
      }
    }
  }
}
