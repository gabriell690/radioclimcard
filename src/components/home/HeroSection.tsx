import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, Heart, ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-95" />
      <div className="absolute inset-0 medical-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Novo Cartão de Benefícios</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
              Radioclim Card
              <span className="block text-2xl md:text-3xl lg:text-4xl font-medium mt-2 text-primary-foreground/90">
                Seu Cartão de Benefícios em Saúde
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up stagger-1">
              Tenha acesso a exames, consultas e serviços da Radioclim com descontos exclusivos 
              através de planos mensais acessíveis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up stagger-2">
              <Button size="xl" variant="glass" asChild>
                <Link to="/planos">
                  Conheça os Planos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/login">
                  Área do Cliente
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-slide-up stagger-3">
              {[
                { value: "5.000+", label: "Clientes" },
                { value: "50+", label: "Especialidades" },
                { value: "40%", label: "Desconto" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Visual */}
          <div className="relative animate-slide-in-right">
            <div className="relative mx-auto max-w-md">
              {/* Main Card */}
              <div className="relative z-10 glass-card rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="gradient-bg rounded-2xl p-6 aspect-[1.6/1] flex flex-col justify-between card-shine">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-primary-foreground/70 font-medium">CARTÃO DE BENEFÍCIOS</div>
                      <div className="text-xl font-bold text-primary-foreground mt-1">Radioclim Card</div>
                    </div>
                    <CreditCard className="w-10 h-10 text-primary-foreground/80" />
                  </div>
                  
                  <div>
                    <div className="text-lg font-semibold text-primary-foreground tracking-wider mb-2">
                      •••• •••• •••• 1234
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs text-primary-foreground/70">TITULAR</div>
                        <div className="text-sm font-medium text-primary-foreground">MARIA SILVA</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-primary-foreground/70">PLANO</div>
                        <div className="text-sm font-medium text-primary-foreground">FAMÍLIA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center animate-float z-20">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center animate-float z-20" style={{ animationDelay: '1s' }}>
                <Heart className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
