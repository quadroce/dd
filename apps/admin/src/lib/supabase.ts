import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Source {
  id: string
  user_id: string | null
  name: string
  url: string
  rss_url?: string
  type: 'rss' | 'html'
  category?: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface Article {
  id: string
  source_id: string
  title: string
  url: string
  summary: string | null
  content: string | null
  published_at: string | null
  tags: string[]
  created_at: string
  sources?: Source
}

export interface Database {
  public: {
    Tables: {
      sources: {
        Row: Source
        Insert: Omit<Source, 'id' | 'created_at'>
        Update: Partial<Omit<Source, 'id' | 'created_at'>>
      }
      articles: {
        Row: Article
        Insert: Omit<Article, 'id' | 'created_at'>
        Update: Partial<Omit<Article, 'id' | 'created_at'>>
      }
    }
  }
}