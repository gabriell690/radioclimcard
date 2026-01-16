import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Scale } from "lucide-react";
import BenefitsGrid from "@/components/sobre/BenefitsGrid";

export default function Sobre() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sobre - Radioclim Card</title>
        <meta
          name="description"
          content="Conheça o Radioclim Card: cartão de benefícios em saúde com descontos reais, sem carência e com planos acessíveis."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          {/* HERO */}
          <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-10" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Vantagens Exclusivas
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                  Por que escolher o{" "}
                  <span className="gradient-text">Radioclim Card</span>?
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mt-6 leading-relaxed">
                  Saúde de qualidade não precisa ser cara, nem complicada. O
                  Radioclim Card oferece acesso a consultas, exames e serviços
                  com descontos reais e imediatos — sem burocracia e sem carência.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={() => navigate("/planos")}>
                    Ver Planos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/checkout")}
                    disabled
                    title="Escolha um plano antes para continuar"
                  >
                    Assinar agora
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* PROBLEMA / SOLUÇÃO */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid gap-8 lg:grid-cols-2 items-start">
                <div className="rounded-3xl bg-white/70 backdrop-blur border border-border p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground">
                    A realidade de quem precisa de saúde hoje
                  </h2>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    Muitas pessoas adiam consultas e exames por preços elevados,
                    demora no atendimento e burocracia. O resultado é simples:
                    problemas pequenos viram urgências — e a conta, no final, fica
                    ainda maior.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/70 backdrop-blur border border-border p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground">
                    A alternativa inteligente
                  </h2>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    O Radioclim Card é um <strong>cartão de benefícios em saúde</strong>{" "}
                    criado para entregar acesso rápido, economia e liberdade de
                    escolha. Você paga uma mensalidade acessível e começa a usar
                    os benefícios imediatamente.
                  </p>

                  <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <li>• Descontos reais em consultas e exames</li>
                    <li>• Agendamento facilitado</li>
                    <li>• Atendimento humanizado</li>
                    <li>• Sem carência e sem análise de perfil</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* BENEFÍCIOS */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Benefícios que fazem diferença no dia a dia
                </h2>
                <p className="text-muted-foreground mt-3">
                  Tudo pensado para cuidar da sua saúde e do seu bolso.
                </p>
              </div>

              <BenefitsGrid />
            </div>
          </section>

          {/* ASSESSORIA + DISCLAIMER */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-white/70 backdrop-blur border border-border p-8 shadow-sm">
                  <div className="flex items-center gap-2 text-primary font-medium mb-2">
                    <Scale className="w-5 h-5" />
                    Assessoria Jurídica (em planos selecionados)
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Um benefício adicional para mais segurança
                  </h3>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    Alguns planos incluem <strong>assessoria jurídica preventiva e orientativa</strong>,
                    oferecendo suporte para dúvidas e orientações do dia a dia, com
                    transparência e responsabilidade.
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Observação: a assessoria é preventiva e orientativa, sem acompanhamento
                    processual.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/70 backdrop-blur border border-border p-8 shadow-sm">
                  <h3 className="text-2xl font-bold text-foreground">
                    Transparência em primeiro lugar
                  </h3>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    O Radioclim Card <strong>não é um plano de saúde</strong>, não possui
                    cobertura obrigatória da ANS e não substitui planos médicos tradicionais.
                    Trata-se de um <strong>cartão de benefícios</strong>, que oferece acesso a
                    serviços de saúde com condições especiais e descontos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="rounded-3xl bg-primary text-primary-foreground p-10 text-center shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Cuidar da saúde nunca foi tão simples
                </h2>
                <p className="mt-3 opacity-90 max-w-2xl mx-auto">
                  Escolha o plano ideal para você, sua família ou sua empresa e comece
                  a usar. Sem carência. Sem burocracia. Sem sustos no bolso.
                </p>

                <div className="mt-8 flex justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate("/planos")}
                  >
                    Escolher meu plano
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
