import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type PlanoDB = {
  id: string;
  nome: string;
  preco: number;
  ativo?: boolean;
};

type PlanoUI = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  popular?: boolean;
  recursos: string[];
};

const PLANOS_UI_FALLBACK: Record<
  string,
  { descricao: string; popular?: boolean; recursos: string[] }
> = {
  "Individual Simples": {
    descricao: "Ideal para quem quer cuidar da própria saúde com economia",
    recursos: [
      "Consultas com desconto",
      "Até 30% em exames",
      "Agendamento online",
      "Carteirinha digital",
      "Resultados digitais",
    ],
  },
  "Individual Premium": {
    descricao: "Benefícios ampliados + assessoria jurídica inclusa",
    popular: true,
    recursos: [
      "Tudo do plano Simples",
      "Até 40% em exames",
      "Atendimento prioritário",
      "Carteirinha digital",
      "Assessoria jurídica preventiva e orientativa",
    ],
  },
  "Plano Família": {
    descricao: "Titular + dependentes (cônjuge e filhos) com assessoria jurídica",
    recursos: [
      "Titular + dependentes",
      "Cônjuge e filhos",
      "Até 40% em exames",
      "Atendimento prioritário",
      "Assessoria jurídica preventiva e orientativa",
    ],
  },
  "Plano Empresarial": {
    descricao: "Benefício para sua equipe com valor por colaborador",
    recursos: [
      "Valor por colaborador",
      "Mínimo 10 colaboradores",
      "Até 50% em exames",
      "Dashboard de gestão",
      "Conta exclusiva de RH",
    ],
  },
};

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

const Planos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [planosDB, setPlanosDB] = useState<PlanoDB[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPlanos() {
      setLoading(true);

      const { data, error } = await supabase
        .from("planos")
        .select("id, nome, preco, ativo")
        .eq("ativo", true)
        .order("preco", { ascending: true });

      if (error) {
        console.error("Erro ao carregar planos:", error.message);
        setPlanosDB([]);
        setLoading(false);
        return;
      }

      setPlanosDB((data ?? []) as PlanoDB[]);
      setLoading(false);
    }

    carregarPlanos();
  }, []);

  const planos: PlanoUI[] = useMemo(() => {
    return (planosDB ?? []).map((p) => {
      const meta = PLANOS_UI_FALLBACK[p.nome] ?? {
        descricao: "",
        recursos: [],
      };

      return {
        id: p.id,
        nome: p.nome,
        descricao: meta.descricao,
        popular: meta.popular,
        recursos: meta.recursos,
        preco: Number(p.preco ?? 0),
      };
    });
  }, [planosDB]);

  function goCheckout(plano: PlanoUI) {
    // state (para seu checkout atual) + querystring (backup / debug / refresh)
    const qs = new URLSearchParams({
      planoId: plano.id,
      nome: plano.nome,
      valor: String(plano.preco),
    }).toString();

    navigate(`/checkout?${qs}`, {
      state: {
        planoId: plano.id,
        nome: plano.nome,
        valor: plano.preco,
      },
    });
  }

  function handleEscolher(plano: PlanoUI) {
    if (!user) {
      // opcional: você pode mandar pro login e voltar pro checkout depois
      navigate("/login");
      return;
    }
    goCheckout(plano);
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
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-[0.06]" />
            <div className="container mx-auto px-4 relative z-10 py-16">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Planos para todos os perfis
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight">
                  Escolha seu <span className="text-primary">plano ideal</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground">
                  Planos acessíveis com benefícios exclusivos.
                </p>
              </div>
            </div>
          </section>

          {/* Planos */}
          <section className="py-14">
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

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {planos.map((plan) => {
                  const isSelected = selectedPlan === plan.id;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={cn(
                        "relative rounded-3xl transition-all duration-300 cursor-pointer",
                        "bg-white/70 dark:bg-white/5 backdrop-blur border",
                        "hover:-translate-y-1 hover:shadow-xl",
                        plan.popular
                          ? "border-primary/30 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.35)]"
                          : "border-border/70",
                        isSelected && "ring-2 ring-primary/70"
                      )}
                    >
                      {/* glow suave */}
                      {plan.popular && (
                        <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent opacity-60 blur-lg" />
                      )}

                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg">
                            Mais Popular
                          </div>
                        </div>
                      )}

                      <div className="relative p-8">
                        <h2 className="text-2xl font-bold mb-2">{plan.nome}</h2>

                        {!!plan.descricao && (
                          <p className="text-sm mb-6 text-muted-foreground leading-relaxed">
                            {plan.descricao}
                          </p>
                        )}

                        <div className="mb-7">
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold tracking-tight">
                              {formatBRL(plan.preco).replace("R$", "R$ ")}
                            </span>
                            <span className="text-muted-foreground mb-1">
                              /mês
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-3 mb-8 text-sm">
                          {plan.recursos.map((beneficio) => (
                            <li key={beneficio} className="flex items-start gap-3">
                              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Check className="h-3.5 w-3.5" />
                              </span>
                              <span className="text-muted-foreground leading-snug">
                                {beneficio}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          type="button"
                          className={cn(
                            "w-full rounded-full h-12 text-base font-semibold transition-all",
                            plan.popular
                              ? "bg-primary hover:bg-primary/90 shadow-md"
                              : "bg-primary/10 hover:bg-primary/15 text-primary"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEscolher(plan);
                          }}
                        >
                          {user ? "Escolher Plano" : "Entrar para escolher"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        {/* Link secundário para debug (opcional) */}
                        {/* <button
                          type="button"
                          className="mt-3 w-full text-xs text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Plano selecionado:", plan);
                          }}
                        >
                          Ver detalhes (debug)
                        </button> */}
                      </div>
                    </div>
                  );
                })}
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