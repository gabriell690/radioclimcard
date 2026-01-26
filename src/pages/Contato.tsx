import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send, MessageCircle, Instagram } from "lucide-react";
import { useMemo, useState } from "react";

const WHATSAPP_PHONE_E164 = " 5583987593850"; // Ex: 55 + DDD + número (sem + e sem espaços)
const INSTAGRAM_URL = "https://www.instagram.com/radioclimcard"; // troque pelo seu
const EMAIL_CONTATO = "contato@radioclimcard.com.br";
const TELEFONE_EXIBICAO = "(83) 98759-3850";
const ENDERECO_EXIBICAO = "Terezinha Carlos Bezerra, 23 - Alto Alegre, Monteiro - PB";

export default function Contato() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const textoWhatsApp = useMemo(() => {
    const partes = [
      "Olá! Quero falar com a equipe do Radioclim Card.",
      nome ? `Nome: ${nome}` : null,
      telefone ? `Telefone: ${telefone}` : null,
      email ? `E-mail: ${email}` : null,
      mensagem ? `Mensagem: ${mensagem}` : null,
    ].filter(Boolean);

    return encodeURIComponent(partes.join("\n"));
  }, [nome, telefone, email, mensagem]);

  const whatsappLink = useMemo(() => {
    return `https://wa.me/${WHATSAPP_PHONE_E164}?text=${textoWhatsApp}`;
  }, [textoWhatsApp]);

  const emailLink = useMemo(() => {
    const subject = encodeURIComponent("Contato - Radioclim Card");
    const body = encodeURIComponent(
      `Nome: ${nome}\nTelefone: ${telefone}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`
    );
    return `mailto:${EMAIL_CONTATO}?subject=${subject}&body=${body}`;
  }, [nome, telefone, email, mensagem]);

  function validarFormulario() {
    if (!nome.trim()) return "Informe seu nome.";
    if (!telefone.trim()) return "Informe seu telefone/WhatsApp.";
    if (!mensagem.trim()) return "Escreva sua mensagem.";
    return null;
  }

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    const erro = validarFormulario();
    if (erro) {
      alert(erro);
      return;
    }

    // Fluxo simples: abre WhatsApp com texto preenchido
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Helmet>
        <title>Contato - Radioclim Card</title>
        <meta
          name="description"
          content="Fale com a Radioclim Card: envie uma mensagem, chame no WhatsApp ou acesse nosso Instagram."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <MessageCircle className="w-4 h-4" />
                  Fale Conosco
                </div>

                <h1 className="text-4xl md:text-5xl font-bold">
                  Entre em contato com a <span className="gradient-text">Radioclim Card</span>
                </h1>

                <p className="text-lg text-muted-foreground mt-4">
                  Tire dúvidas, solicite informações e escolha o plano ideal. Responderemos o mais rápido possível.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2 items-start max-w-6xl mx-auto">
                {/* FORM */}
                <div className="rounded-3xl bg-white/70 backdrop-blur border border-border shadow-sm p-8">
                  <h2 className="text-2xl font-bold mb-2">Envie uma mensagem</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Preencha os dados abaixo e clique em “Enviar”. Você será direcionado ao WhatsApp com a mensagem pronta.
                  </p>

                  <form onSubmit={handleEnviar} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Seu nome</label>
                        <Input
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Ex.: Nome Completo"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground">Telefone/WhatsApp</label>
                        <Input
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          placeholder="Ex.: (83) 9xxxx-xxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">E-mail (opcional)</label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex.: seuemail@dominio.com"
                        type="email"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Mensagem</label>
                      <Textarea
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Escreva sua dúvida ou solicitação..."
                        rows={5}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Enviar pelo WhatsApp
                      <Send className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(emailLink, "_self")}
                      >
                        Enviar por e-mail
                        <Mail className="w-4 h-4 ml-2" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(whatsappLink, "_blank", "noopener,noreferrer")}
                      >
                        Abrir WhatsApp
                        <MessageCircle className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Ao enviar, você concorda em compartilhar seus dados para retorno do atendimento.
                    </p>
                  </form>
                </div>

                {/* CONTACT INFO */}
                <div className="space-y-6">
                  <div className="rounded-3xl bg-white/70 backdrop-blur border border-border shadow-sm p-8">
                    <h2 className="text-2xl font-bold mb-4">Canais de atendimento</h2>

                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Telefone</p>
                          <p className="text-muted-foreground">{TELEFONE_EXIBICAO}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">E-mail</p>
                          <p className="text-muted-foreground">{EMAIL_CONTATO}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Endereço</p>
                          <p className="text-muted-foreground">{ENDERECO_EXIBICAO}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => window.open(whatsappLink, "_blank", "noopener,noreferrer")}
                      >
                        WhatsApp
                        <MessageCircle className="w-4 h-4 ml-2" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer")}
                      >
                        Instagram
                        <Instagram className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* CTA secundário */}
                  <div className="rounded-3xl bg-primary text-primary-foreground p-8 shadow-lg">
                    <h3 className="text-2xl font-bold">Quer contratar agora?</h3>
                    <p className="opacity-90 mt-2">
                      Veja os planos disponíveis e escolha o ideal para você, sua família ou sua empresa.
                    </p>
                    <Button
                      variant="secondary"
                      className="mt-5"
                      onClick={() => (window.location.href = "/planos")}
                    >
                      Ver Planos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
