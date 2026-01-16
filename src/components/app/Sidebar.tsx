import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Calendar,
  FileText,
  Users,
  Bell,
  Stethoscope,
  LogOut,
} from "lucide-react";

const items = [
  { to: "/app", label: "Meu Card", icon: CreditCard, end: true },
  { to: "/app/agendamentos", label: "Agendamentos", icon: Calendar },
  { to: "/app/exames", label: "Exames", icon: FileText },
  { to: "/app/servicos", label: "Serviços", icon: Stethoscope }, // NOVO
  { to: "/app/dependentes", label: "Dependentes", icon: Users },
  { to: "/app/notificacoes", label: "Notificações", icon: Bell },
];

export default function Sidebar() {
  const navigate = useNavigate();

  // Mock por enquanto (depois vem do Supabase/AuthContext)
  const userName = "Gabriel";
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  function handleLogout() {
    // TODO: integrar com supabase.auth.signOut()
    // await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <aside className="w-72 bg-white border-r h-screen flex flex-col">
      {/* Topo: "perfil" (clique leva ao /app/perfil) */}
      <div className="p-4 border-b">
        <button
          type="button"
          onClick={() => navigate("/app/perfil")}
          className="w-full flex items-center justify-between gap-3 rounded-2xl px-3 py-2 hover:bg-muted transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {initials || "U"}
            </div>

            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                Ver perfil
              </p>
            </div>
          </div>

          <span className="text-xs text-muted-foreground">›</span>
        </button>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2 flex-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé: logout */}
      <div className="p-4 border-t">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
