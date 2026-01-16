import {
  Stethoscope,
  Percent,
  CalendarDays,
  Users,
  FileText,
  Clock,
  Heart,
  ShieldCheck,
} from "lucide-react";

type Benefit = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const BENEFITS: Benefit[] = [
  {
    title: "Consultas Especializadas",
    description:
      "Acesso a diversas especialidades médicas com valores reduzidos e atendimento facilitado.",
    Icon: Stethoscope,
  },
  {
    title: "Descontos em Exames",
    description:
      "Economize em exames laboratoriais e de imagem com descontos reais e imediatos.",
    Icon: Percent,
  },
  {
    title: "Agendamento Online",
    description:
      "Mais praticidade para marcar consultas e exames de forma rápida e organizada.",
    Icon: CalendarDays,
  },
  {
    title: "Inclua Dependentes",
    description:
      "Planos para cuidar de quem você ama: cônjuge e filhos com as mesmas vantagens.",
    Icon: Users,
  },
  {
    title: "Resultados Digitais",
    description:
      "Acesse exames e laudos digitalmente com mais comodidade e segurança.",
    Icon: FileText,
  },
  {
    title: "Atendimento Prioritário",
    description:
      "Mais agilidade no agendamento e no atendimento conforme o seu plano.",
    Icon: Clock,
  },
  {
    title: "Cuidado Humanizado",
    description:
      "Equipe preparada e acolhedora para oferecer uma experiência melhor em saúde.",
    Icon: Heart,
  },
  {
    title: "Sem Carência",
    description:
      "Contratou, usou. Benefícios disponíveis imediatamente após a adesão.",
    Icon: ShieldCheck,
  },
];

export default function BenefitsGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {BENEFITS.map(({ title, description, Icon }) => (
        <article
          key={title}
          className="rounded-3xl bg-white/70 backdrop-blur border border-border shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {description}
          </p>
        </article>
      ))}
    </div>
  );
}
