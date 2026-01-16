import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function CheckoutPendente() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as {
    pedidoId?: string;
    planoNome?: string;
    valorTotal?: number;
    tipo?: string;
    qtdColaboradores?: number | null;
  };

  return (
    <>
      <Helmet>
        <title>Pagamento Pendente - Radioclim Card</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto rounded-3xl bg-white shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold">Pedido gerado</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Assim que confirmarmos o pagamento, seu card será ativado.
              </p>

              <div className="rounded-2xl border p-4 mt-6 text-left">
                <p className="text-sm text-muted-foreground">Pedido</p>
                <p className="font-mono text-sm">{state.pedidoId || "-"}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plano</span>
                  <span className="font-semibold">{state.planoNome || "-"}</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-bold">
                    R$ {(state.valorTotal ?? 0).toFixed(2)}
                  </span>
                </div>

                {state.tipo === "empresarial" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Quantidade de colaboradores: {state.qtdColaboradores ?? "-"}
                  </p>
                )}

                <div className="mt-4 rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    PIX da empresa ainda não integrado.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Em breve: QR Code e copia e cola automático.
                  </p>
                </div>
              </div>

              <Button className="w-full mt-6" onClick={() => navigate("/planos")}>
                Voltar aos Planos
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
