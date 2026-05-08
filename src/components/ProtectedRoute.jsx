// ─────────────────────────────────────────────────────────────────────────────
// ProtectedRoute.jsx
// Bloqueia acesso ao /admin se não estiver logado no Supabase.
// Mostra spinner enquanto verifica a sessão.
// ─────────────────────────────────────────────────────────────────────────────
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Aguarda Supabase verificar se há sessão ativa
  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
