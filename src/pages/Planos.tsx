import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Star, User, Users, Building2, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "individual",
    name: "Individual",
    icon: User,
    price: "49,90",
    description: "Ideal para quem quer cuidar da própria saúde com economia",
    popular: false,
    color: "from-primary to-primary-dark",
    features: [
      { text: "Consultas com até 30% de desconto", included: true },
      { text: "Exames laboratoriais com 30% off", included: true },
      { text: "Exames de imagem com 25% off", included: true },
      { text: "Agendamento online 24h", included: true },
      { text: "Carteirinha digital com QR Code", included: true },
      { text: "Resultados de exames digitais", included: true },
      { text: "Dependentes", included: false },
      { text: "Atendimento prioritário", included: false },
    ]
  },
  {
    id: "familia",
    name: "Família",
    icon: Users,
    price: "89,90",
    description: "Perfeito para cuidar de toda a família com ainda mais benefícios",
    popular: true,
    color: "from-accent to-primary",
    features: [
      { text: "Consultas com até 40% de desconto", included: true },
      { text: "Exames laboratoriais com 40% off", included: true },
      { text: "Exames de imagem com 35% off", included: true },
      { text: "Agendamento online 24h", included: true },
      { text: "Carteirinha digital com QR Code", included: true },
      { text: "Resultados de exames digitais", included: true },
      { text: "Até 4 dependentes inclusos", included: true },
      { text: "Atendimento prioritário", included: true },
    ]
  },
  {
    id: "empresarial",
    name: "Empresarial",
    icon: Building2,
    price: "29,90",
    priceNote: "por colaborador",
    description: "A melhor opção para empresas que cuidam de seus colaboradores",
    popular: false,
    color: "from-primary-dark to-accent",
    features: [
      { text: "Consultas com até 50% de desconto", included: true },
      { text: "Exames laboratoriais com 50% off", included: true },
      { text: "Exames de imagem com 45% off", included: true },
      { text: "Agendamento online 24h", included: true },
      { text: "Dashboard de gestão para RH", included: true },
      { text: "Relatórios mensais de utilização", included: true },
      { text: "Mínimo 10 colaboradores", included: true },
      { text: "Suporte dedicado", included: true },
    ]
  }
];

const Planos = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>Planos - Radioclim Card</title>
        <meta name="description" content="Conheça os planos do Radioclim Card: Individual, Família e Empresarial. Escolha o ideal para você e comece a economizar em consultas e exames." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          {/* Hero */}
          <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-5" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                  <Sparkles className="w-4 h-4" />
                  Planos para todos os perfis
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
                  Escolha seu <span className="gradient-text">plano ideal</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground animate-slide-up stagger-1">
                  Planos acessíveis com benefícios exclusivos. Comece a cuidar da sua saúde 
                  com economia hoje mesmo.
                </p>
              </div>
            </div>
          </section>

          {/* Plans */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "relative rounded-3xl transition-all duration-500 cursor-pointer",
                      plan.popular 
                        ? "bg-foreground text-primary-foreground lg:scale-105 shadow-2xl" 
                        : "glass-card hover:shadow-lg",
                      selectedPlan === plan.id && !plan.popular && "ring-2 ring-primary shadow-lg"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg">
                          <Star className="w-4 h-4 fill-current" />
                          Mais Popular
                        </div>
                      </div>
                    )}

                    <div className="p-8">
                      {/* Header */}
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br",
                        plan.color
                      )}>
                        <plan.icon className="w-8 h-8 text-primary-foreground" />
                      </div>

                      <h2 className={cn(
                        "text-2xl font-bold mb-2",
                        plan.popular ? "text-primary-foreground" : "text-foreground"
                      )}>
                        {plan.name}
                      </h2>
                      
                      <p className={cn(
                        "text-sm mb-6 min-h-[40px]",
                        plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {plan.description}
                      </p>

                      {/* Price */}
                      <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                          <span className={cn(
                            "text-lg",
                            plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>R$</span>
                          <span className={cn(
                            "text-5xl font-bold",
                            plan.popular ? "text-primary-foreground" : "text-foreground"
                          )}>{plan.price}</span>
                          <span className={cn(
                            "text-lg",
                            plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>/mês</span>
                        </div>
                        {plan.priceNote && (
                          <span className={cn(
                            "text-sm",
                            plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"
                          )}>{plan.priceNote}</span>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              feature.included 
                                ? plan.popular ? "bg-primary" : "bg-primary/10"
                                : plan.popular ? "bg-primary-foreground/10" : "bg-muted"
                            )}>
                              <Check className={cn(
                                "w-3 h-3",
                                feature.included 
                                  ? plan.popular ? "text-primary-foreground" : "text-primary"
                                  : plan.popular ? "text-primary-foreground/30" : "text-muted-foreground/50"
                              )} />
                            </div>
                            <span className={cn(
                              "text-sm",
                              feature.included 
                                ? plan.popular ? "text-primary-foreground" : "text-foreground"
                                : plan.popular ? "text-primary-foreground/40 line-through" : "text-muted-foreground/50 line-through"
                            )}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "glass" : "hero"}
                        size="lg"
                        asChild
                      >
                        <Link to="/login">
                          Escolher este Plano
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Preview */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Dúvidas frequentes
                </h2>
                <p className="text-muted-foreground mb-8">
                  Precisa de mais informações? Entre em contato conosco.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/contato">
                      Falar com atendimento
                    </Link>
                  </Button>
                  <Button variant="ghost" size="lg" asChild>
                    <a href="https://wa.me/5583991234567" target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
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
};

export default Planos;
