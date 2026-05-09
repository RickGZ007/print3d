import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, LogOut, X, LayoutGrid, Image as ImageIcon, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import ProjectForm from "../components/ProjectForm";
import MaterialsManager from "../components/admin/MaterialsManager";
import MateriaisAdmin from "../components/admin/MateriaisAdmin";
import SobreNosManager from "../components/admin/SobreNosManager";
import { projetosApi } from "../services/api";
import { resolveImageUrl } from "../services/imageUtils";

const BADGE = {
  Industrial:   "bg-badge-industrial-bg text-badge-industrial-text",
  Decoração:    "bg-badge-decoration-bg text-badge-decoration-text",
  Prototipagem: "bg-badge-prototype-bg  text-badge-prototype-text",
  Medicina:     "bg-badge-medicine-bg   text-badge-medicine-text",
  Educação:     "bg-badge-education-bg  text-badge-education-text",
};

const TAB_TITLES = {
  projetos:  "Gerenciar Projetos",
  materiais: "Materiais",
  cores:     "Cores / Filamentos",
  sobre:     "Sobre Nós",
};

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [projetos,   setProjetos]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [apiError,   setApiError]  = useState("");
  const [saving,     setSaving]    = useState(false);
  const [saveError,  setSaveError] = useState("");
  const [activeTab,  setActiveTab] = useState("projetos");
  const [formOpen,   setFormOpen]  = useState(false);
  const [editTarget, setEditTarget]= useState(null);
  const [deleteId,   setDeleteId]  = useState(null);
  const [deleting,   setDeleting]  = useState(false);

  const fetchProjetos = useCallback(async () => {
    setLoading(true); setApiError("");
    try { setProjetos(await projetosApi.listar()); }
    catch (err) { setApiError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (activeTab === "projetos") fetchProjetos(); }, [activeTab, fetchProjetos]);

  const abrirFormNovo = () => { setEditTarget(null); setFormOpen(true); setSaveError(""); };
  const abrirFormEdit = (p) => { setEditTarget(p);   setFormOpen(true); setSaveError(""); };
  const fecharForm    = ()  => { setFormOpen(false); setEditTarget(null); };

  const salvarProjeto = async (projeto) => {
    setSaving(true); setSaveError("");
    try {
      if (editTarget) {
        const att = await projetosApi.atualizar(projeto.id, projeto);
        setProjetos((prev) => prev.map((p) => p.id === att.id ? att : p));
      } else {
        const novo = await projetosApi.criar(projeto);
        setProjetos((prev) => [novo, ...prev]);
      }
      fecharForm();
    } catch (err) { setSaveError(`Erro ao salvar: ${err.message}`); }
    finally { setSaving(false); }
  };

  const executarDelete = async () => {
    setDeleting(true);
    try {
      await projetosApi.excluir(deleteId);
      setProjetos((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) { alert(`Erro: ${err.message}`); }
    finally { setDeleting(false); }
  };

  const handleLogout = async () => { await logout(); navigate("/admin/login"); };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col md:flex-row">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-surface/50">
          <div>
            <h1 className="text-lg font-black text-primary">{TAB_TITLES[activeTab]}</h1>
            <p className="text-xs text-muted">Olá, {user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-secondary hover:text-error bg-surface px-3 py-2 rounded-lg border border-border transition-colors">
            <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sair</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* ── PROJETOS ── */}
          {activeTab === "projetos" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="surface px-4 py-3 text-center min-w-[80px]">
                  <p className="text-2xl font-black text-primary">{projetos.length}</p>
                  <p className="text-xs text-muted">projetos</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={fetchProjetos} className="btn-secondary px-3 py-2.5"><RefreshCw className="w-4 h-4" /></button>
                  <button onClick={abrirFormNovo} className="btn-primary"><Plus className="w-4 h-4" /> Novo projeto</button>
                </div>
              </div>

              {apiError && (
                <div className="alert-error">
                  <AlertCircle className="w-4 h-4" /><p className="flex-1">{apiError}</p>
                  <button onClick={fetchProjetos} className="text-xs underline">Tentar novamente</button>
                </div>
              )}

              {formOpen && (
                <div className="surface border-accent/30 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-primary">{editTarget ? "Editar projeto" : "Novo projeto"}</h2>
                    <button onClick={fecharForm} className="text-muted hover:text-primary"><X className="w-5 h-5" /></button>
                  </div>
                  {saveError && <div className="alert-error mb-4 text-xs"><AlertCircle className="w-4 h-4" />{saveError}</div>}
                  <ProjectForm projeto={editTarget} onSave={salvarProjeto} onCancel={fecharForm} saving={saving} />
                </div>
              )}

              <div className="surface overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-semibold text-primary flex items-center gap-2 text-sm">
                    <LayoutGrid className="w-4 h-4 text-accent" /> Lista de projetos
                  </h2>
                </div>

                {loading && (
                  <div className="flex items-center justify-center gap-3 py-16 text-secondary">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    <span className="text-sm">Carregando...</span>
                  </div>
                )}

                {!loading && (
                  <div className="sm:hidden divide-y divide-border">
                    {projetos.map((p) => (
                      <div key={p.id} className="p-4 flex gap-3">
                        <img src={resolveImageUrl(p.imagem)} alt={p.titulo} referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-surface2" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-primary truncate">{p.titulo}</p>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${BADGE[p.categoria] || "bg-surface2 text-secondary"}`}>{p.categoria}</span>
                          <p className="text-xs text-muted mt-1 line-clamp-1">{p.finalidade}</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <button onClick={() => abrirFormEdit(p)} className="p-1.5 bg-surface2 rounded-lg text-muted hover:text-admin-action-edit transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteId(p.id)} className="p-1.5 bg-surface2 rounded-lg text-muted hover:text-admin-action-delete transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && (
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs text-muted uppercase tracking-wide">
                          <th className="text-left px-5 py-3 font-semibold">Projeto</th>
                          <th className="text-left px-4 py-3 font-semibold">Categoria</th>
                          <th className="text-left px-4 py-3 font-semibold">Material</th>
                          <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Finalidade</th>
                          <th className="text-right px-5 py-3 font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {projetos.map((p) => (
                          <tr key={p.id} className="hover:bg-admin-row-hover transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <img src={resolveImageUrl(p.imagem)} alt={p.titulo} referrerPolicy="no-referrer"
                                  className="w-10 h-10 object-cover rounded-lg bg-surface2 flex-shrink-0" />
                                <span className="font-medium text-primary text-sm max-w-[180px] truncate">{p.titulo}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${BADGE[p.categoria] || "bg-surface2 text-secondary"}`}>{p.categoria}</span>
                            </td>
                            <td className="px-4 py-3 text-secondary text-xs">{p.material}</td>
                            <td className="px-4 py-3 text-muted text-xs max-w-[200px] truncate hidden lg:table-cell">{p.finalidade}</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => abrirFormEdit(p)} className="p-1.5 rounded-lg text-muted hover:text-admin-action-edit hover:bg-surface2 transition-colors"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-muted hover:text-admin-action-delete hover:bg-surface2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!loading && projetos.length === 0 && !apiError && (
                  <div className="py-16 text-center">
                    <ImageIcon className="w-10 h-10 text-muted mx-auto mb-3" />
                    <p className="text-secondary text-sm">Nenhum projeto cadastrado.</p>
                    <button onClick={abrirFormNovo} className="mt-3 text-accent text-sm hover:underline">Adicionar o primeiro</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MATERIAIS (CRUD) ── */}
          {activeTab === "materiais" && (
            <div className="surface p-6"><MateriaisAdmin /></div>
          )}

          {/* ── CORES / FILAMENTOS ── */}
          {activeTab === "cores" && (
            <div className="surface p-6"><MaterialsManager /></div>
          )}

          {/* ── SOBRE NÓS ── */}
          {activeTab === "sobre" && (
            <div className="surface p-6"><SobreNosManager /></div>
          )}
        </div>
      </main>

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-primary text-lg mb-2">Confirmar exclusão</h3>
            <p className="text-secondary text-sm mb-6">Tem certeza? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={executarDelete} disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 bg-error hover:bg-error/80 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}{deleting ? "Excluindo..." : "Sim, excluir"}
              </button>
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="btn-secondary flex-1 justify-center">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
