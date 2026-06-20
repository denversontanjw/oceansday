import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // Fail loudly at startup rather than silently returning empty results.
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. " +
      "Set them in .env.local (development) or your Vercel project settings (production)."
  );
}

// IMPORTANT: this client uses the service role key and must only ever be
// imported from server-side code (API routes / route handlers / middleware).
// Never import this file from a Client Component.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
