// supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client outside of a component
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);