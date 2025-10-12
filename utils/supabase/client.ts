import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aoedthlhvpxvxahpvnwy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZWR0aGxodnB4dnhhaHB2bnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNzQzMDMsImV4cCI6MjA3NDc1MDMwM30.pmve6T0gX92SBmQQMfOCq5Zr4UCBYPGObGdh7zC1iZU';

// Singleton Supabase client - prevents "Multiple GoTrueClient instances" warning
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
}

// Export the singleton instance
export const supabase = getSupabaseClient();