import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import PlansPreviewSection from "@/components/home/PlansPreviewSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Radioclim Card - Seu Cartão de Benefícios em Saúde</title>
        <meta name="description" content="Tenha acesso a exames, consultas e serviços da Radioclim com descontos exclusivos através de planos mensais acessíveis. Cartão de benefícios em saúde para você e sua família." />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <BenefitsSection />
          <PlansPreviewSection />
          <HowItWorksSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
