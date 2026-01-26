import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading: authLoading, role } = useAuth();
  const location = useLocation();

  const [checkingOrder, setCheckingOrder] = useState(true);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let alive = true;

    // sempre que algo relevante mudar, volta para "checando"
    setCheckingOrder(true);

    // watchdog: se algo travar, não fica eterno
    const watchdog = setTimeout(() => {
      if (!alive) return;
      console.warn("[ProtectedRoute] watchdog acionado — liberando tela.");
      setIsPending(false);
      setCheckingOrder(false);
    }, 8000);

    async function check() {
      try {
        // Se auth ainda está carregando, aguarda a próxima render (não prende pra sempre por causa do watchdog)
        if (authLoading) return;

        // não logado
        if (!user) {
          if (alive) setCheckingOrder(false);
          return;
        }

        // admin não checa pendência
        if (role === "admin") {
          if (alive) {
            setIsPending(false);
            setCheckingOrder(false);
          }
          return;
        }

        // client: checa último pedido
        const { data, error } = await supabase
          .from("pedidos")
          .select("status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Erro ao checar pedido:", error);
          if (alive) setIsPending(false);
        } else {
          const st = String(data?.status ?? "");
          if (alive) setIsPending(st === "pendente" || st === "aguardando_pagamento");
        }
      } finally {
        if (alive) setCheckingOrder(false);
        clearTimeout(watchdog);
      }
    }

    check();

    return () => {
      alive = false;
      clearTimeout(watchdog);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, role, authLoading]);

  if (authLoading || checkingOrder) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== "admin" && isPending) {
    return <Navigate to="/checkout/pendente" replace />;
  }

  return children;
}