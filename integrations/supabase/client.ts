// integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import { Json } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

export interface User {
  id: string // This will be Supabase Auth user ID
  email?: string | null
  created_at: string
  credits?: number | null
}

export interface Interview {
  id: number
  userId: string
  jobPosition: string | null
  jobDescription: string | null
  questions: Json | null
  created_at: string
  duration: number | null
  types?: string[] | null
}