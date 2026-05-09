import { LayoutGrid, Palette, LogOut, Printer, ExternalLink, Info, Layers } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { id: "projetos",  label: "Projetos",         icon: LayoutGrid },
  { id: "materiais", label: "Materiais",         icon: Layers     },
  { id: "cores",     label: "Cores / Filamentos",icon: Palette    },
  { id: "sobre",     label: "Sobre Nós",         icon: Info       },
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate("/admin/login"); };

  return (
    <aside className="w-full md:w-64 bg-admin-sidebar border-b md:border-b-0 md:border-r border-border flex md:flex-col flex-row md:min-h-screen">
      <div className="hidden md:flex items-center gap-2 px-5 py-6 border-b border-border">
        <div className="w-7 h-7 bg-accent rounded flex items-center justify-center">
          <Printer className="w-3.5 h-3.5 text-btn-primary-text" />
        </div>
        <span className="font-black text-primary text-sm tracking-tight">
          PRINT<span className="text-accent">3D</span>
          <span className="text-muted font-normal ml-1">admin</span>
        </span>
      </div>

      <nav className="flex md:flex-col flex-row flex-1 p-2 md:p-3 gap-1 overflow-x-auto md:overflow-x-visible">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onTabChange(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all border flex-shrink-0 ${
              activeTab === id
                ? "bg-admin-active-bg text-admin-active-text border-admin-active-border"
                : "text-secondary hover:bg-surface2 hover:text-primary border-transparent"
            }`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden md:flex flex-col gap-2 p-3 border-t border-border">
        <div className="px-3 py-2">
          <p className="text-xs text-muted">Logado como</p>
          <p className="text-xs text-secondary font-medium truncate">{user?.email}</p>
        </div>
        <a href="/" target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs text-secondary hover:text-primary transition-colors rounded-lg hover:bg-surface2">
          <ExternalLink className="w-3.5 h-3.5" /> Ver site público
        </a>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs text-secondary hover:text-error transition-colors rounded-lg hover:bg-surface2 w-full text-left">
          <LogOut className="w-3.5 h-3.5" /> Sair
        </button>
      </div>
    </aside>
  );
}
