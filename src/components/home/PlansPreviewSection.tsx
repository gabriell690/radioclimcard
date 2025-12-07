import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight, Users, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Individual",
    icon: User,
    price: "49,90",
    description: "Ideal para quem quer cuidar da própria saúde",
    popular: false,
    features: [
      "Consultas com desconto",
      "Até 30% em exames",
      "Agendamento online",
      "Carteirinha digital",
      "Resultados digitais"
    ]
  },
  {
    name: "Família",
    icon: Users,
    price: "89,90",
    description: "Perfeito para cuidar de toda a família",
    popular: true,
    features: [
      "Tudo do plano Individual",
      "Até 4 dependentes",
      "Até 40% em exames",
      "Atendimento prioritário",
      "Suporte exclusivo via WhatsApp"
    ]
  },
  {
    name: "Empresarial",
    icon: Building2,
    price: "29,90",
    description: "Benefício para sua equipe",
    priceNote: "por colaborador",
    popular: false,
    features: [
      "Mínimo 10 colaboradores",
      "Até 50% em exames",
      "Dashboard de gestão",
      "Relatórios mensais",
      "Conta exclusiva de RH"
    ]
  }
];

const PlansPreviewSection = () => {
  return (
    <section className="py-24 bg-muted/50 relative overflow-hidden">
      <div className="absolute inset-0 medical-pattern opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nossos Planos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Escolha o plano{" "}
            <span className="gradient-text">ideal para você</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Planos acessíveis com benefícios exclusivos para você e sua família.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "relative rounded-3xl p-8 transition-all duration-300",
                plan.popular 
                  ? "bg-foreground text-primary-foreground scale-105 shadow-2xl" 
                  : "glass-card hover-lift"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    <Star className="w-4 h-4 fill-current" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                plan.popular ? "bg-primary" : "bg-primary/10"
              )}>
                <plan.icon className={cn(
                  "w-7 h-7",
                  plan.popular ? "text-primary-foreground" : "text-primary"
                )} />
              </div>

              <h3 className={cn(
                "text-2xl font-bold mb-2",
                plan.popular ? "text-primary-foreground" : "text-foreground"
              )}>
                {plan.name}
              </h3>
              
              <p className={cn(
                "text-sm mb-6",
                plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {plan.description}
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "text-sm",
                    plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>R$</span>
                  <span className={cn(
                    "text-4xl font-bold",
                    plan.popular ? "text-primary-foreground" : "text-foreground"
                  )}>{plan.price}</span>
                  <span className={cn(
                    "text-sm",
                    plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>/mês</span>
                </div>
                {plan.priceNote && (
                  <span className={cn(
                    "text-xs",
                    plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"
                  )}>{plan.priceNote}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                      plan.popular ? "bg-primary" : "bg-primary/10"
                    )}>
                      <Check className={cn(
                        "w-3 h-3",
                        plan.popular ? "text-primary-foreground" : "text-primary"
                      )} />
                    </div>
                    <span className={cn(
                      "text-sm",
                      plan.popular ? "text-primary-foreground/90" : "text-foreground"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full" 
                variant={plan.popular ? "glass" : "hero"}
                size="lg"
                asChild
              >
                <Link to="/planos">
                  Escolher Plano
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansPreviewSection;
