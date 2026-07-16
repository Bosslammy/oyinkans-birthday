// ── Supabase project settings ──────────────────────────────────────────
// Find these under: Supabase dashboard → Project Settings → API
// SUPABASE_URL   = "Project URL"
// SUPABASE_ANON_KEY = "anon public" key (NOT the service_role key)
//
// This key is safe to expose in frontend code — it only allows what your
// Row Level Security policies permit (see supabase-setup.sql).

const SUPABASE_URL = "https://touxqjtgpwuwluxucxfh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdXhxanRncHd1d2x1eHVjeGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTIxNDUsImV4cCI6MjA5OTc4ODE0NX0.OaJrBNzzIPo__cWqzfUhu6Ei81kBdWipCx3Wb0fchPU";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);