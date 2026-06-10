import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase con service role — SOLO para uso en funciones serverless
// (API routes, Route Handlers). NUNCA importar en componentes de cliente.
//
// Requiere la variable de entorno SUPABASE_SERVICE_ROLE_KEY (sin NEXT_PUBLIC_).
// Vercel → Settings → Environment Variables.

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan variables de entorno del servidor: NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
