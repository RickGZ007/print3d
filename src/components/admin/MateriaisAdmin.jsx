// ─────────────────────────────────────────────────────────────────────────────
// MateriaisAdmin.jsx — CRUD de materiais + toggle ativo/inativo
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, Loader2, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { materiaisApi } from "../../services/api";

const PROPS = ["resistencia", "acabamento", "facilidade", "flexibilidade"];
const LABELS = { resistencia: "Resistência", acabamento: "Acabamento", facilidade: "Facilidade", flexibilidade: "Flexibilidade" };

const EMPTY_FORM = {
  nome: "", descricao: "", destaque: "", ativo: true,
  resistencia: 3, acabamento: 3, facilidade: 3, flexibilidade: 3,
};

function PropSlider({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted w-24 flex-shrink-0">{label}</span>
      <input type="range" min={1} max={5} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-orange-500" />
      <span className="text-xs font-bold text-accent w-6 text-center">{value}</span>
    </div>
  );
}

function PropBar({ valor }) {
  return (
    <div className="flex-1 bg-surface2 rounded-full h-1.5 overflow-hidden">
      <div className="h-full bg-accent rounded-full" style={{ width: `${(valor / 5) * 100}%` }} />
    </div>
  );
}

export default function MateriaisAdmin() {
  const [materiais,  setMateriais]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [erro,       setErro]       = useState("");
  const [formOpen,   setFormOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [saveErro,   setSaveErro]   = useState("");
  const [toggling,   setToggling]   = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const fetchMateriais = async () => {
    setLoading(true); setErro("");
    try { setMateriais(await materiaisApi.listar()); }
    catch (err) { setErro(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMateriais(); }, []);

  // ── Formulário ────────────────────────────────────────────────────────────
  const abrirNovo = () => {
    setEditTarget(null); setForm(EMPTY_FORM);
    setSaveErro(""); setFormOpen(true);
  };
  const abrirEdit = (m) => {
    setEditTarget(m);
    setForm({ nome: m.nome, descricao: m.descricao, destaque: m.destaque || "",
      ativo: m.ativo, resistencia: m.resistencia, acabamento: m.acabamento,
      facilidade: m.facilidade, flexibilidade: m.flexibilidade });
    setSaveErro(""); setFormOpen(true);
  };
  const fecharForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const setProp = (prop, val) => setForm((p) => ({ ...p, [prop]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.descricao.trim()) {
      setSaveErro("Nome e descrição são obrigatórios."); return;
    }
    setSaving(true); setSaveErro("");
    try {
      if (editTarget) {
        const att = await materiaisApi.atualizar(editTarget.id, form);
        setMateriais((prev) => prev.map((m) => m.id === att.id ? att : m));
      } else {
        const novo = await materiaisApi.criar(form);
        setMateriais((prev) => [...prev, novo]);
      }
      fecharForm();
    } catch (err) { setSaveErro(err.message); }
    finally { setSaving(false); }
  };

  // ── Toggle ativo ──────────────────────────────────────────────────────────
  const handleToggle = async (m) => {
    setToggling(m.id);
    try {
      const att = await materiaisApi.toggleAtivo(m.id, m.ativo);
      setMateriais((prev) => prev.map((x) => x.id === att.id ? att : x));
    } catch (err) { setErro(err.message); }
    finally { setToggling(null); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await materiaisApi.excluir(deleteId);
      setMateriais((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) { setErro(err.message); }
    finally { setDeleting(false); }
  };

  const ativos    = materiais.filter((m) => m.ativo).length;
  const inativos  = materiais.length - ativos;

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-secondary">
      <Loader2 className="w-5 h-5 animate-spin text-accent" />
      <span className="text-sm">Carregando materiais...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {erro && <div className="alert-error"><AlertCircle className="w-4 h-4" /><p className="flex-1">{erro}</p></div>}

      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-3">
          <div className="surface px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-black text-primary">{materiais.length}</p>
            <p className="text-xs text-muted">total</p>
          </div>
          <div className="bg-success-bg border border-success-border rounded-2xl px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-black text-success">{ativos}</p>
            <p className="text-xs text-success/70">ativos</p>
          </div>
          <div className="bg-error-bg border border-error-border rounded-2xl px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-black text-error">{inativos}</p>
            <p className="text-xs text-error/70">inativos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchMateriais} className="btn-secondary px-3 py-2.5"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={abrirNovo} className="btn-primary"><Plus className="w-4 h-4" /> Novo material</button>
        </div>
      </div>

      {/* Formulário */}
      {formOpen && (
        <div className="surface border-accent/30 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              {editTarget ? "Editar material" : "Novo material"}
            </h2>
            <button onClick={fecharForm} className="text-muted hover:text-primary"><X className="w-5 h-5" /></button>
          </div>

          {saveErro && <div className="alert-error mb-4 text-xs"><AlertCircle className="w-4 h-4" />{saveErro}</div>}

          <form onSubmit={handleSave} className="flex flex-col gap-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nome *</label>
                <input type="text" name="nome" value={form.nome} onChange={handleChange}
                  placeholder="Ex: PLA, ABS, PETG, TPU..." className="form-input" />
              </div>
              <div>
                <label className="form-label">Destaque / Badge</label>
                <input type="text" name="destaque" value={form.destaque} onChange={handleChange}
                  placeholder="Ex: Alta resistência" className="form-input" />
              </div>
            </div>

            <div>
              <label className="form-label">Descrição *</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3}
                placeholder="Descreva as características do material..."
                className="form-input resize-none" />
            </div>

            {/* Propriedades com sliders */}
            <div className="surface p-4">
              <p className="form-label mb-3">Propriedades (1 = baixo, 5 = alto)</p>
              <div className="flex flex-col gap-3">
                {PROPS.map((prop) => (
                  <PropSlider key={prop} label={LABELS[prop]} value={form[prop]}
                    onChange={(val) => setProp(prop, val)} />
                ))}
              </div>
            </div>

            {/* Ativo */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-6 rounded-full transition-colors relative ${form.ativo ? "bg-accent" : "bg-surface2 border border-border"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.ativo ? "translate-x-5" : "translate-x-1"}`} />
              </div>
              <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} className="hidden" />
              <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                {form.ativo ? "Visível no site público" : "Oculto no site público"}
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editTarget ? "Salvar alterações" : "Adicionar material"}
              </button>
              <button type="button" onClick={fecharForm} className="btn-secondary">
                <X className="w-4 h-4" /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de materiais */}
      <div className="flex flex-col gap-3">
        {materiais.map((m) => (
          <div key={m.id}
            className={`surface p-5 transition-all ${!m.ativo ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-lg font-black text-primary">{m.nome}</h3>
                  {m.destaque && (
                    <span className="text-xs bg-accent-muted text-accent border border-accent/20 px-2 py-0.5 rounded-full font-semibold">
                      {m.destaque}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${m.ativo ? "bg-success-bg text-success border border-success-border" : "bg-error-bg text-error border border-error-border"}`}>
                    {m.ativo ? "Visível" : "Oculto"}
                  </span>
                </div>
                <p className="text-sm text-secondary mb-3 line-clamp-2">{m.descricao}</p>

                {/* Barras de propriedade */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {PROPS.map((prop) => (
                    <div key={prop} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted w-20">{LABELS[prop]}</span>
                      <PropBar valor={m[prop]} />
                      <span className="text-[10px] text-muted">{m[prop]}/5</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => handleToggle(m)} disabled={toggling === m.id}
                  className="p-2 rounded-lg border border-border hover:border-border-strong bg-surface2 text-muted transition-colors"
                  title={m.ativo ? "Ocultar no site" : "Mostrar no site"}>
                  {toggling === m.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : m.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-success" />}
                </button>
                <button onClick={() => abrirEdit(m)}
                  className="p-2 rounded-lg border border-border hover:border-accent/50 bg-surface2 text-muted hover:text-admin-action-edit transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(m.id)}
                  className="p-2 rounded-lg border border-border hover:border-error/50 bg-surface2 text-muted hover:text-admin-action-delete transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {materiais.length === 0 && !loading && (
          <div className="text-center py-12 text-secondary text-sm">
            Nenhum material cadastrado.
            <button onClick={abrirNovo} className="block mx-auto mt-2 text-accent hover:underline">Adicionar o primeiro</button>
          </div>
        )}
      </div>

      {/* Modal de confirmação de delete */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-primary text-lg mb-2">Confirmar exclusão</h3>
            <p className="text-secondary text-sm mb-6">Tem certeza? O material será removido permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 bg-error hover:bg-error/80 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Excluindo..." : "Sim, excluir"}
              </button>
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="btn-secondary flex-1 justify-center">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
