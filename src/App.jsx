import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage    from "./pages/LandingPage";
import LoginPage      from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"             element={<LandingPage />} />
        <Route path="/admin/login"  element={<LoginPage />} />
        <Route path="/admin"        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
