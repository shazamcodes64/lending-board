import { createClient } from "@supabase/supabase-js";

// NEXT_PUBLIC_ vars are empty strings during `next build` static analysis even
// with force-dynamic pages — the SDK throws on empty string, not undefined.
// Fallback placeholder prevents the build-time throw; at runtime the real env
// vars are always present (Vercel/local .env.local).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL     ?? "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
);
