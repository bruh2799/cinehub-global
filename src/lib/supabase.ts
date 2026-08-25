import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for server-side operations
export const supabaseAdmin = process.env.SUPABASE_SERVICE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY)
  : null;
