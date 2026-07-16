// ── Supabase project settings ──────────────────────────────────────────
// Find these under: Supabase dashboard → Project Settings → API
// SUPABASE_URL   = "Project URL"
// SUPABASE_ANON_KEY = "anon public" key (NOT the service_role key)
//
// This key is safe to expose in frontend code — it only allows what your
// Row Level Security policies permit (see supabase-setup.sql).

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
