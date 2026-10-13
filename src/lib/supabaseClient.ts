import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Provide dummy values for development if env vars are missing
// This allows the app to render, but auth will fail (which is expected)
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseKey || "placeholder-key";

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "⚠️ Supabase Config Not Found. Create .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY"
  );
}

export const supabase = createClient(url, key);
