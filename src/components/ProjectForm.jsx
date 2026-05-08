import { useState, useEffect } from "react";
import { Save, X, ImageIcon, Link, Loader2 } from "lucide-react";
import { CATEGORIAS, NOMES_MATERIAIS } from "../data/mockData";
import { resolveImageUrl } from "../services/imageUtils";

const EMPTY = {
  titulo: "", imagem: "",
  categoria: CATEGORIAS[0], material: NOMES_MATERIAIS[0], finalidade: "",
};

export default function ProjectForm({ projeto, onSave, onCancel, saving }) {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (projeto) {
      setForm({
        titulo:     projeto.titulo     || "",
        imagem:     projeto.imagem     || "",
        categoria:  projeto.categoria  || CATEGORIAS[0],
        material:   projeto.material   || NOMES_MATERIAIS[0],
        finalidade: projeto.finalidade || "",
      });
      setPreview(resolveImageUrl(projeto.imagem || ""));
    } else {
      setForm(EMPTY);
      setPreview("");
    }
    setErrors({});
  }, [projeto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name === "imagem") setPreview(resolveImageUrl(value));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.titulo.trim())     errs.titulo     = "Título é obrigatório.";
    if (!form.finalidade.trim()) errs.finalidade = "Finalidade é obrigatória.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      ...form,
      imagem: form.imagem.trim() ||
        `https://placehold.co/600x400/111827/f97316?text=${encodeURIComponent(form.titulo)}`,
      id: projeto?.id,
    });
  };

  const isDriveLink = form.imagem.includes("drive.google.com");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

      {/* Título */}
      <div>
        <label className="form-label">Título do projeto *</label>
        <input type="text" name="titulo" value={form.titulo} onChange={handleChange}
          placeholder="Ex: Suporte industrial modular" className="form-input" />
        {errors.titulo && <p className="text-xs text-error mt-1">{errors.titulo}</p>}
      </div>

      {/* Imagem */}
      <div>
        <label className="form-label"><ImageIcon className="inline w-3.5 h-3.5 mr-1" />Link da imagem</label>

        <input type="text" name="imagem" value={form.imagem} onChange={handleChange}
          placeholder="https://drive.google.com/file/d/... ou https://..."
          className="form-input" />

        {/* Badge Google Drive detectado */}
        {isDriveLink && (
          <div className="flex items-center gap-2 mt-2 text-xs text-success bg-success-bg border border-success-border rounded-lg px-3 py-2">
            <Link className="w-3.5 h-3.5 flex-shrink-0" />
            Link do Google Drive detectado — imagem convertida automaticamente.
          </div>
        )}

        {/* Preview da imagem */}
        {preview && (
          <div className="mt-3 rounded-xl overflow-hidden border border-border h-40">
            <img src={preview} alt="preview" referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        )}
      </div>

      {/* Categoria + Material */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Categoria</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} className="form-input">
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Material</label>
          <select name="material" value={form.material} onChange={handleChange} className="form-input">
            {NOMES_MATERIAIS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Finalidade */}
      <div>
        <label className="form-label">Finalidade / Descrição *</label>
        <textarea name="finalidade" value={form.finalidade} onChange={handleChange} rows={3}
          placeholder="Descreva o objetivo e uso da peça impressa..."
          className="form-input resize-none" />
        {errors.finalidade && <p className="text-xs text-error mt-1">{errors.finalidade}</p>}
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {projeto ? "Salvar alterações" : "Adicionar projeto"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          <X className="w-4 h-4" /> Cancelar
        </button>
      </div>
    </form>
  );
}
