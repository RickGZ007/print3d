import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Palette, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { coresApi } from "../../services/api";

export default function MaterialsManager() {
  const [cores,    setCores]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [erro,     setErro]     = useState("");
  const [toggling, setToggling] = useState(null);

  const fetchCores = async () => {
    setLoading(true); setErro("");
    try { setCores(await coresApi.listar()); }
    catch (err) { setErro(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCores(); }, []);

  const handleToggle = async (cor) => {
    setToggling(cor.id);
    try {
      const atualizada = await coresApi.toggle(cor.id, cor.em_estoque);
      setCores((prev) => prev.map((c) => c.id === atualizada.id ? atualizada : c));
    } catch (err) { setErro(`Erro: ${err.message}`); }
    finally { setToggling(null); }
  };

  const emEstoque    = cores.filter((c) => c.em_estoque).length;
  const indisponivel = cores.length - emEstoque;

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-secondary">
      <Loader2 className="w-5 h-5 animate-spin text-accent" />
      <span className="text-sm">Carregando cores...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {erro && (
        <div className="alert-error">
          <AlertCircle className="w-4 h-4" />
          <p className="flex-1">{erro}</p>
          <button onClick={fetchCores} className="text-xs underline">Tentar novamente</button>
        </div>
      )}

      {/* Resumo */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-3">
          <div className="surface px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-black text-primary">{cores.length}</p>
            <p className="text-xs text-muted mt-1">Total</p>
          </div>
          <div className="bg-success-bg border border-success-border rounded-2xl px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-black text-success">{emEstoque}</p>
            <p className="text-xs text-success/70 mt-1">Em estoque</p>
          </div>
          <div className="bg-error-bg border border-error-border rounded-2xl px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-black text-error">{indisponivel}</p>
            <p className="text-xs text-error/70 mt-1">Indisponível</p>
          </div>
        </div>
        <button onClick={fetchCores} className="btn-secondary text-xs gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar
        </button>
      </div>

      <p className="text-xs font-semibold text-muted uppercase tracking-wide flex items-center gap-2">
        <Palette className="w-3.5 h-3.5" />
        Clique para alternar disponibilidade — salva automaticamente no Supabase
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cores.map((cor) => (
          <button key={cor.id} onClick={() => handleToggle(cor)}
            disabled={toggling === cor.id}
            className={`group relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 disabled:cursor-wait ${
              cor.em_estoque
                ? "bg-surface border-success/40 hover:border-success"
                : "bg-page border-border/50 hover:border-border-strong opacity-60 hover:opacity-100"
            }`}>
            {toggling === cor.id && (
              <div className="absolute inset-0 bg-page/70 rounded-xl flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
              </div>
            )}
            <div className="w-10 h-10 rounded-full border-2 border-white/10 shadow-inner"
              style={{ backgroundColor: cor.hex }} />
            <span className="text-xs font-medium text-secondary">{cor.nome}</span>
            <span className={`text-xs flex items-center gap-1 font-semibold ${cor.em_estoque ? "text-success" : "text-error"}`}>
              {cor.em_estoque
                ? <><CheckCircle className="w-3 h-3" />Em estoque</>
                : <><XCircle className="w-3 h-3" />Indisponível</>}
            </span>
            <span className="text-[10px] text-muted font-mono">{cor.hex}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
