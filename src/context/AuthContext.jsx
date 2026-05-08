// ─────────────────────────────────────────────────────────────────────────────
// src/context/AuthContext.jsx
//
// Autenticação real via Supabase Auth.
// - Login com email + senha
// - Sessão persistida automaticamente (cookie seguro)
// - Logout limpa a sessão
// - onAuthStateChange detecta mudanças em tempo real
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // aguarda Supabase verificar sessão

  useEffect(() => {
    // Verifica se já existe sessão ativa ao carregar
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Escuta mudanças de sessão em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  // Login com email + senha via Supabase
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  // Logout — Supabase invalida a sessão automaticamente
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
