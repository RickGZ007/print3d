// ─────────────────────────────────────────────────────────────────────────────
// src/services/api.js — CRUD via Supabase SDK
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from "../lib/supabase";

function throwIfError({ error }) {
  if (error) throw new Error(error.message);
}

// ── PROJETOS ──────────────────────────────────────────────────────────────────
export const projetosApi = {
  async listar() {
    const res = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    throwIfError(res); return res.data;
  },
  async criar(dados) {
    const { id: _, ...dadosSemId } = dados;
    const res = await supabase.from("projects").insert(dadosSemId).select().single();
    throwIfError(res); return res.data;
  },
  async atualizar(id, dados) {
    const { id: _, ...dadosSemId } = dados;
    const res = await supabase.from("projects").update(dadosSemId).eq("id", id).select().single();
    throwIfError(res); return res.data;
  },
  async excluir(id) {
    const res = await supabase.from("projects").delete().eq("id", id);
    throwIfError(res);
  },
};

// ── FILAMENTOS (CORES) ────────────────────────────────────────────────────────
export const coresApi = {
  async listar() {
    const res = await supabase.from("filaments").select("*").order("id");
    throwIfError(res); return res.data;
  },
  async toggle(id, emEstoqueAtual) {
    const res = await supabase.from("filaments").update({ em_estoque: !emEstoqueAtual }).eq("id", id).select().single();
    throwIfError(res); return res.data;
  },
};

// ── MATERIAIS ─────────────────────────────────────────────────────────────────
export const materiaisApi = {
  async listar() {
    const res = await supabase.from("materials").select("*").order("id");
    throwIfError(res); return res.data;
  },
  async listarAtivos() {
    const res = await supabase.from("materials").select("*").eq("ativo", true).order("id");
    throwIfError(res); return res.data;
  },
  async criar(dados) {
    const { id: _, ...dadosSemId } = dados;
    const res = await supabase.from("materials").insert(dadosSemId).select().single();
    throwIfError(res); return res.data;
  },
  async atualizar(id, dados) {
    const { id: _, ...dadosSemId } = dados;
    const res = await supabase.from("materials").update(dadosSemId).eq("id", id).select().single();
    throwIfError(res); return res.data;
  },
  async excluir(id) {
    const res = await supabase.from("materials").delete().eq("id", id);
    throwIfError(res);
  },
  async toggleAtivo(id, ativoAtual) {
    const res = await supabase.from("materials").update({ ativo: !ativoAtual }).eq("id", id).select().single();
    throwIfError(res); return res.data;
  },
};

// ── CONFIGURAÇÕES DO SITE ─────────────────────────────────────────────────────
export const configApi = {
  async get(key) {
    const res = await supabase.from("site_config").select("value").eq("key", key).single();
    if (res.error) return null;
    return res.data.value;
  },
  async getMultiple(keys) {
    const res = await supabase.from("site_config").select("key, value").in("key", keys);
    throwIfError(res);
    return Object.fromEntries(res.data.map((r) => [r.key, r.value]));
  },
  async set(key, value) {
    const res = await supabase.from("site_config")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
      .select().single();
    throwIfError(res); return res.data;
  },
};