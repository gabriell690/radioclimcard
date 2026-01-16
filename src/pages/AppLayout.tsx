import { Outlet } from "react-router-dom";
import Sidebar from "@/components/app/Sidebar";

export default function AppLayout() {
  return (
    <div className="h-screen flex bg-muted/30 overflow-hidden">
      <div className="shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
