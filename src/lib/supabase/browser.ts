import { createClient } from "@supabase/supabase-js";

// Singleton lazy — se crea sólo en el browser (nunca en SSR),
// usando únicamente la anon key pública.
let _client: ReturnType<typeof createClient> | null = null;

export function getBrowserSupabase() {
  if (_client) return _client;
  _client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return _client;
}
