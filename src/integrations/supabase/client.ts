import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Conexão com o NOVO Supabase
const SUPABASE_URL = "https://dvfvrfjzhwjosmrxsclw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZnZyZmp6aHdqb3NtcnhzY2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Njg1MDQsImV4cCI6MjA3MDQ0NDUwNH0.ZK-D_gJ7X2ukosT9PSZ34Uro8ejFqkc7_m_zQEZxtCI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
