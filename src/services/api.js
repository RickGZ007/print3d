// ─────────────────────────────────────────────────────────────────────────────
// src/services/api.js
//
// CRUD completo via Supabase SDK.
// Substitui todos os fetch() que iam para o Spring Boot.
// Sem CORS. Sem Railway. Sem variável VITE_API_URL.
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from "../lib/supabase";

// ── Utilitário de erro ────────────────────────────────────────────────────────
function throwIfError({ error }) {
  if (error) throw new Error(error.message);
}

// ── PROJETOS ──────────────────────────────────────────────────────────────────
export const projetosApi = {

  // Lista todos os projetos ordenados por data de criação
  async listar() {
    const res = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    throwIfError(res);
    return res.data;
  },

  // Cria novo projeto
  async criar(dados) {
    const res = await supabase
      .from("projects")
      .insert(dados)
      .select()
      .single();
    throwIfError(res);
    return res.data;
  },

  // Atualiza projeto existente
  async atualizar(id, dados) {
    const res = await supabase
      .from("projects")
      .update(dados)
      .eq("id", id)
      .select()
      .single();
    throwIfError(res);
    return res.data;
  },

  // Exclui projeto
  async excluir(id) {
    const res = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    throwIfError(res);
  },
};

// ── FILAMENTOS (CORES) ────────────────────────────────────────────────────────
export const coresApi = {

  // Lista todas as cores
  async listar() {
    const res = await supabase
      .from("filaments")
      .select("*")
      .order("id");
    throwIfError(res);
    return res.data;
  },

  // Alterna emEstoque true/false
  async toggle(id, emEstoqueAtual) {
    const res = await supabase
      .from("filaments")
      .update({ em_estoque: !emEstoqueAtual })
      .eq("id", id)
      .select()
      .single();
    throwIfError(res);
    return res.data;
  },
};
