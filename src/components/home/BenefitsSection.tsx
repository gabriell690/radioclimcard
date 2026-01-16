import { 
  Stethoscope, 
  Calendar, 
  Percent, 
  Users, 
  FileText, 
  Clock,
  Heart,
  Shield
} from "lucide-react";

const benefits = [
  {
    icon: Stethoscope,
    title: "Consultas Especializadas",
    description: "Acesso a mais de 50 especialidades médicas com preços reduzidos."
  },
  {
    icon: Percent,
    title: "Descontos em Exames",
    description: "Até 40% de desconto em exames laboratoriais e de imagem."
  },
  {
    icon: Calendar,
    title: "Agendamento Online",
    description: "Agende suas consultas e exames de forma rápida e prática."
  },
  {
    icon: Users,
    title: "Inclua Dependentes",
    description: "Adicione familiares ao seu plano com condições especiais."
  },
  {
    icon: FileText,
    title: "Resultados Digitais",
    description: "Acesse seus exames e laudos diretamente pelo aplicativo."
  },
  {
    icon: Clock,
    title: "Atendimento Prioritário",
    description: "Prioridade no agendamento e atendimento na clínica."
  },
  {
    icon: Heart,
    title: "Cuidado Humanizado",
    description: "Equipe preparada para oferecer o melhor atendimento."
  },
  {
    icon: Shield,
    title: "Sem Carência",
    description: "Comece a usar seu cartão imediatamente após a adesão."
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 medical-pattern opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Vantagens Exclusivas
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Por que escolher o{" "}
            <span className="gradient-text">Radioclim Saúde Medical Card?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Benefícios pensados para cuidar da sua saúde e do seu bolso.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group glass-card rounded-2xl p-6 hover-lift cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <benefit.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
