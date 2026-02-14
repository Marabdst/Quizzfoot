import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    // Fallback to dummy values to allow build to pass if env vars are missing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
