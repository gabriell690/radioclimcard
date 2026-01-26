import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import MeuCard from "@/pages/app/MeuCard";
import AdminDashboard from "@/pages/app/admin/AdminDashboard";

type Role = "client" | "admin";

export default function AppHome() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>("client");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("perfis")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && data?.role) setRole(data.role as Role);

      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-6">Carregando...</div>;

  return role === "admin" ? <AdminDashboard /> : <MeuCard />;
}