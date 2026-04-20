import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rvynshwwiomybskqbmpd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2eW5zaHd3aW9teWJza3FibXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDUwNzQsImV4cCI6MjA5MjA4MTA3NH0.-1ocx9oRwM_3FVKS8RzDkmvYMpZLUJ4eRFIczVuBwwc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
