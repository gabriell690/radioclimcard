import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Role = "client" | "admin";

export function useRole() {
  const [role, setRole] = useState<Role>("client");
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setLoadingRole(false);
        return;
      }

      const { data, error } = await supabase
        .from("perfis")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && data?.role) setRole(data.role as Role);

      setLoadingRole(false);
    })();
  }, []);

  return { role, loadingRole };
}
