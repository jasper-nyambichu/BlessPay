// lib/supabaseClient.js or similar file
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables exist
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing');
}

export const supabase = createClient(supabaseUrl as string, supabaseKey as string)