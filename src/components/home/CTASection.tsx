import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 medical-pattern opacity-30" />
      
      {/* Decorative */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Comece a cuidar da sua saúde com economia
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Adquira agora seu Radioclim Card e tenha acesso imediato a todos os benefícios. 
            Sem carência, sem burocracia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="xl" variant="glass" asChild>
              <Link to="/planos">
                Escolher meu Plano
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a href="tel:+558333511234">
                <Phone className="w-5 h-5 mr-2" />
                Fale Conosco
              </a>
            </Button>
          </div>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
            <span className="text-sm text-primary-foreground">
              Dúvidas? Fale conosco pelo WhatsApp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
