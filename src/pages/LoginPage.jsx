import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate("/admin");
    else setError(result.message);
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 glow-accent rounded-full pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-accent rounded-2xl mb-4 shadow-lg shadow-accent/30">
            <Printer className="w-7 h-7 text-btn-primary-text" />
          </div>
          <h1 className="text-2xl font-black text-primary">PRINT<span className="text-accent">3D</span></h1>
          <p className="text-muted text-sm mt-1">Painel Administrativo</p>
        </div>

        <div className="surface p-6 shadow-2xl shadow-black/50">
          <h2 className="text-lg font-bold text-primary mb-6">Entrar na conta</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label className="form-label">E-mail</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="seu@email.com" required autoComplete="email" className="form-input" />
            </div>
            <div>
              <label className="form-label">Senha</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••" required className="form-input pr-10" />
                <button type="button" onClick={() => setShowPass((v) => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="alert-error text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="btn-primary justify-center py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {loading
                ? <span className="w-4 h-4 border-2 border-btn-primary-text/30 border-t-btn-primary-text rounded-full animate-spin" />
                : <LogIn className="w-4 h-4" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-muted mt-6">
          <a href="/" className="hover:text-secondary transition-colors">← Voltar para o site</a>
        </p>
      </div>
    </div>
  );
}
