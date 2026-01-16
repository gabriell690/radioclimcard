import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Heart, ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-95" />
      <div className="absolute inset-0 medical-pattern" />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* TEXT CONTENT */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">
                Novo Cartão de Benefícios
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
              Radioclim Card
              <span className="block text-2xl md:text-3xl lg:text-4xl font-medium mt-2 text-primary-foreground/90">
                Seu Cartão de Benefícios em Saúde
              </span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up stagger-1">
              Tenha acesso a exames, consultas e serviços da Radioclim com descontos
              exclusivos através de planos mensais acessíveis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up stagger-2">
              <Button size="xl" variant="glass" asChild>
                <Link to="/planos">
                  Conheça os Planos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                size="xl"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/login">Área do Cliente</Link>
              </Button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-slide-up stagger-3">
              {[
                { value: "5.000+", label: "Clientes" },
                { value: "50+", label: "Especialidades" },
                { value: "40%", label: "Desconto" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD IMAGE (OFICIAL) */}
          <div className="relative flex justify-center items-center animate-slide-in-right">
            <div className="relative">
              <img
                src="/images/cartao-oficial.png"
                alt="Radioclim Saúde Medical Card"
                className="
                  w-full
                  max-w-[560px]
                  rotate-[-15deg]
                  translate-y-8
                  drop-shadow-[0_40px_60px_rgba(0,0,0,0.35)]
                  transition-transform
                  duration-700
                  hover:rotate-[-12deg]
                "
              />

              {/* Floating icons */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center animate-float z-20">
                <Shield className="w-8 h-8 text-primary" />
              </div>

              <div
                className="absolute -bottom-6 -right-6 w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center animate-float z-20"
                style={{ animationDelay: "1s" }}
              >
                <Heart className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
