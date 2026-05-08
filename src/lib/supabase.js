// ─────────────────────────────────────────────────────────────────────────────
// src/lib/supabase.js
//
// Cria o cliente Supabase — substitui todo o back-end Spring Boot.
// As credenciais ficam nas variáveis de ambiente do Netlify.
//
// VITE_SUPABASE_URL     → Settings → API → Project URL
// VITE_SUPABASE_ANON_KEY → Settings → API → anon public key
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@supabase/supabase-js";

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
