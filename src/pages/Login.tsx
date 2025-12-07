import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    cpf: "",
    phone: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isSignUp ? "Cadastro realizado!" : "Login realizado!",
        description: isSignUp 
          ? "Bem-vindo ao Radioclim Card! Você será redirecionado."
          : "Redirecionando para sua área...",
      });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? "Cadastro" : "Login"} - Radioclim Card</title>
        <meta name="description" content="Acesse sua conta Radioclim Card ou cadastre-se para começar a aproveitar todos os benefícios em saúde." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12 bg-background">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="max-w-md w-full mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Radioclim Card</h1>
                <p className="text-sm text-muted-foreground">Área do Cliente</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {isSignUp ? "Crie sua conta" : "Bem-vindo de volta!"}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp 
                  ? "Preencha seus dados para começar"
                  : "Entre para acessar sua área exclusiva"
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleChange}
                      required={isSignUp}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => setFormData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                        maxLength={14}
                        required={isSignUp}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                        maxLength={15}
                        required={isSignUp}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  {!isSignUp && (
                    <Link to="/recuperar-senha" className="text-sm text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" size="lg" variant="hero" className="w-full" disabled={isLoading}>
                {isLoading ? "Carregando..." : (isSignUp ? "Criar conta" : "Entrar")}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary font-medium hover:underline"
                >
                  {isSignUp ? "Faça login" : "Cadastre-se"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden lg:flex w-1/2 gradient-bg relative overflow-hidden items-center justify-center p-16">
          <div className="absolute inset-0 medical-pattern opacity-30" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
          
          <div className="relative z-10 text-center max-w-lg">
            <div className="glass-card rounded-3xl p-8 mb-8">
              <div className="gradient-bg rounded-2xl p-6 aspect-[1.6/1] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <div className="text-xs text-primary-foreground/70 font-medium">CARTÃO DE BENEFÍCIOS</div>
                    <div className="text-xl font-bold text-primary-foreground mt-1">Radioclim Card</div>
                  </div>
                  <CreditCard className="w-10 h-10 text-primary-foreground/80" />
                </div>
                
                <div className="text-left">
                  <div className="text-lg font-semibold text-primary-foreground tracking-wider mb-2">
                    •••• •••• •••• 1234
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-primary-foreground/70">TITULAR</div>
                      <div className="text-sm font-medium text-primary-foreground">SEU NOME</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-primary-foreground/70">PLANO</div>
                      <div className="text-sm font-medium text-primary-foreground">FAMÍLIA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Sua saúde em primeiro lugar
            </h2>
            <p className="text-primary-foreground/80">
              Acesse seus benefícios, agende consultas e acompanhe seus exames em um só lugar.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
