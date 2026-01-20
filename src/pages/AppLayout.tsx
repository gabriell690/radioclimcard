import { Outlet } from "react-router-dom";
import Sidebar from "@/components/app/Sidebar";
import { useRole } from "@/lib/useRole";

export default function AppLayout() {
  const { role, loadingRole } = useRole();

  if (loadingRole) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <main className="flex-1 bg-muted/40">
        <Outlet />
      </main>
    </div>
  );
}
