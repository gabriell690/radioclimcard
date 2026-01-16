import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PartnersGrid from "@/components/conveniados/PartnersGrid";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";

export default function Conveniados() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Clínicas Conveniadas - Radioclim Card</title>
        <meta
          name="description"
          content="Conheça as clínicas e parceiros conveniados do Radioclim Card."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Building2 className="w-4 h-4" />
                  Clínicas Conveniadas
                </div>

                <h1 className="text-4xl md:text-5xl font-bold">
                  Nossos parceiros e clínicas{" "}
                  <span className="gradient-text">conveniadas</span>
                </h1>

                <p className="text-lg text-muted-foreground mt-4">
                  Uma rede de parceiros para você ter acesso a consultas, exames e serviços
                  com condições especiais.
                </p>
              </div>

              <PartnersGrid />

              <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => navigate("/planos")}>
                  Ver Planos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/contato")}>
                  Quero ser parceiro
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
