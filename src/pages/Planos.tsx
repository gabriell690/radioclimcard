import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { criarPedido } from "@/services/checkout";

type Plano = {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  popular?: boolean;
};

const Planos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [planos, setPlanos] = useState<Plano[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPlanos() {
      const { data, error } = await supabase
        .from("planos")
        .select("id, nome, descricao, valor, popular");

      if (!error && data) {
        setPlanos(data);
      } else {
        console.error(error);
      }

      setLoading(false);
    }

    carregarPlanos();
  }, []);

 function handleAssinar(plano: Plano) {
  navigate("/checkout", {
    state: {
      planoId: plano.id,
      nome: plano.nome,
      valor: plano.valor,
    },
  });
}

  return (
    <>
      <Helmet>
        <title>Planos - Radioclim Card</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          {/* Hero */}
          <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-5" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Planos para todos os perfis
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Escolha seu <span className="gradient-text">plano ideal</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Planos acessíveis com benefícios exclusivos.
                </p>
              </div>
            </div>
          </section>

          {/* Plans */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {loading && (
                <p className="text-center text-muted-foreground">
                  Carregando planos...
                </p>
              )}

              {!loading && planos.length === 0 && (
                <p className="text-center text-red-500">
                  Nenhum plano encontrado no sistema.
                </p>
              )}

              <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {planos.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "relative rounded-3xl transition-all duration-500 cursor-pointer glass-card hover:shadow-lg",
                      selectedPlan === plan.id &&
                        "ring-2 ring-primary shadow-lg"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg">
                          Mais Popular
                        </div>
                      </div>
                    )}

                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-2">
                        {plan.nome}
                      </h2>

                      <p className="text-sm mb-6 text-muted-foreground">
                        {plan.descricao}
                      </p>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg text-muted-foreground">
                            R$
                          </span>
                          <span className="text-5xl font-bold">
                            {Number(plan.valor).toFixed(2)}
                          </span>
                          <span className="text-lg text-muted-foreground">
                            /mês
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => handleAssinar(plan)}
                      >
                        Escolher este Plano
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Planos;
