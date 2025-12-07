import { UserPlus, CreditCard, Calendar, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Cadastre-se",
    description: "Faça seu cadastro rápido e escolha o plano ideal para você."
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Receba seu Card",
    description: "Acesse sua carteirinha digital instantaneamente no sistema."
  },
  {
    icon: Calendar,
    step: "03",
    title: "Agende Online",
    description: "Escolha a especialidade, data e horário de sua preferência."
  },
  {
    icon: Stethoscope,
    step: "04",
    title: "Seja Atendido",
    description: "Compareça na clínica e aproveite todos os benefícios."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simples e Rápido
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Como <span className="gradient-text">funciona?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Em poucos passos você começa a economizar na sua saúde.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step Circle */}
                <div className="relative mx-auto mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto">
                    <div className="w-24 h-24 rounded-full bg-card shadow-lg flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
