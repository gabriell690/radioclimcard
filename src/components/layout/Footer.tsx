import { Link } from "react-router-dom";
import { CreditCard, Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">Radioclim Saúde</span>
                <span className="text-xs text-primary -mt-1 font-medium">Medical Card</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Seu cartão de benefícios em saúde. Acesso a exames, consultas e serviços 
              com descontos exclusivos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Links Rápidos</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/planos" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                Nossos Planos
              </Link>
              <Link to="/sobre" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                Sobre Nós
              </Link>
              <Link to="/contato" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                Contato
              </Link>
              <Link to="/login" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                Área do Cliente
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 text-primary" />
                <span>(83) 98759-3850</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@radioclimcard.com.br</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Terezinha Carlos Bezerra, 23 - Alto Alegre, Monteiro - PB<br /></span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Redes Sociais</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors group"
              >
                <Instagram className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors group"
              >
                <Facebook className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Radioclim Card. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
