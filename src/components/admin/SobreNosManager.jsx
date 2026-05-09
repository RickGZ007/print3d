// ─────────────────────────────────────────────────────────────────────────────
// SobreNosManager.jsx — edita o texto da seção "Sobre Nós" pelo painel admin
// Salva na tabela site_config do Supabase (chave → valor)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { configApi } from "../../services/api";

export default function SobreNosManager() {
  const [titulo,  setTitulo]  = useState("");
  const [texto,   setTexto]   = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState(null); // "ok" | "erro"
  const [erro,    setErro]    = useState("");

  // Busca os textos atuais do banco ao montar
  useEffect(() => {
    configApi.getMultiple(["sobre_titulo", "sobre_texto"])
      .then((data) => {
        setTitulo(data.sobre_titulo || "");
        setTexto(data.sobre_texto  || "");
      })
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setStatus(null); setErro("");
    try {
      await configApi.set("sobre_titulo", titulo);
      await configApi.set("sobre_texto",  texto);
      setStatus("ok");
      // Limpa o badge de sucesso após 3 segundos
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setErro(err.message); setStatus("erro");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-secondary">
      <Loader2 className="w-5 h-5 animate-spin text-accent" />
      <span className="text-sm">Carregando texto...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-base font-bold text-primary mb-1">Seção "Sobre Nós"</h2>
        <p className="text-xs text-muted">
          O texto abaixo aparece na seção "Sobre Nós" do site público.
          Edite e clique em Salvar — a alteração aparece imediatamente.
        </p>
      </div>

      {/* Título */}
      <div>
        <label className="form-label">Título</label>
        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Feitos para fazer" className="form-input" />
      </div>

      {/* Texto */}
      <div>
        <label className="form-label">Texto / Descrição</label>
        <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={6}
          placeholder="Descreva sua empresa..."
          className="form-input resize-none leading-relaxed" />
        <p className="text-[10px] text-muted mt-1">{texto.length} caracteres</p>
      </div>

      {/* Preview */}
      {(titulo || texto) && (
        <div className="surface p-5 border-accent/20">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-3">Preview</p>
          <h3 className="text-2xl font-black text-primary mb-3">{titulo}</h3>
          <p className="text-secondary text-sm leading-relaxed">{texto}</p>
        </div>
      )}

      {/* Erro */}
      {status === "erro" && (
        <div className="alert-error"><AlertCircle className="w-4 h-4" />{erro}</div>
      )}

      {/* Botão */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>

        {status === "ok" && (
          <span className="flex items-center gap-1.5 text-xs text-success">
            <CheckCircle className="w-4 h-4" /> Salvo com sucesso!
          </span>
        )}
      </div>
    </div>
  );
}
