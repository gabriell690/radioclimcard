import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type CheckoutPayload = {
  planoId: string;
  nome: string;
  valor: number;
};

function toNumber(v: string | null) {
  if (!v) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);

  const submittingRef = useRef(false);

  const payload: CheckoutPayload | null = useMemo(() => {
    // 1) tenta vir do navigate(..., { state })
    const state = location.state as Partial<CheckoutPayload> | null;

    const planoId =
      state?.planoId?.toString() || searchParams.get("planoId") || "";
    const nome = state?.nome?.toString() || searchParams.get("nome") || "";
    const valor =
      typeof state?.valor === "number" ? state.valor : toNumber(searchParams.get("valor"));

    if (!planoId || !nome || !valor) return null;

    return { planoId, nome, valor };
  }, [location.state, searchParams]);

  useEffect(() => {
    // Espera auth carregar (evita comportamento “às vezes”)
    if (authLoading) return;

    // Se não logado, manda pro login (e depois você pode voltar)
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Se não tiver dados do plano, volta pros planos
    if (!payload) {
      navigate("/planos", { replace: true });
      return;
    }

    setBootLoading(false);
  }, [authLoading, user, payload, navigate]);

  async function confirmarAssinatura() {
    if (!user || !payload) return;
    if (submittingRef.current) return; // trava duplo clique
    submittingRef.current = true;

    setProcessing(true);

    try {
      // IMPORTANTE: user_id = auth.uid() para passar no RLS do insert
      const { error } = await supabase.from("pedidos").insert({
  user_id: user.id,
  plano_id: payload.planoId,
  valor: payload.valor,
  status: "pendente",
});

      if (error) {
        console.error("Erro ao criar pedido:", error);
        // aqui você pode trocar por toast
        alert("Não foi possível criar o pedido. Veja o console e as policies (RLS).");
        return;
      }

      // fluxo pós-pedido (você escolhe)
      navigate("/checkout/pendente", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Falha inesperada ao processar. Veja o console.");
    } finally {
      setProcessing(false);
      submittingRef.current = false;
    }
  }

  if (bootLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // daqui pra baixo, user e payload existem
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Confirme seu plano e finalize a assinatura.
          </p>

          <div className="rounded-3xl border bg-white/70 dark:bg-white/5 backdrop-blur p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Plano</div>
                <div className="text-xl font-semibold">{payload!.nome}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground">Valor</div>
                <div className="text-xl font-bold">
                  R$ {payload!.valor.toFixed(2).replace(".", ",")}
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/planos")}
                disabled={processing}
              >
                Voltar
              </Button>

              <Button
                type="button"
                className="rounded-full"
                onClick={confirmarAssinatura}
                disabled={processing}
              >
                {processing ? "Processando..." : "Confirmar assinatura"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}