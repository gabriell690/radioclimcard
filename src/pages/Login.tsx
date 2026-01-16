import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // ✅ CADASTRO (SEM INSERT MANUAL NO BANCO)
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Cadastro realizado!",
          description: "Conta criada com sucesso. Faça login para continuar.",
        });

        setIsSignUp(false);
      } else {
        // ✅ LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Login realizado!",
          description: "Redirecionando para sua área...",
        });

        navigate("/app");
      }
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message ?? "Erro ao autenticar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? "Cadastro" : "Login"} - Radioclim Card</title>
      </Helmet>

      <div className="min-h-screen flex">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12 bg-background">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
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
                <h1 className="text-2xl font-bold">Radioclim Card</h1>
                <p className="text-sm text-muted-foreground">Área do Cliente</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <>
                  <Label>Nome</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Label>Senha</Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Processando..."
                  : isSignUp
                  ? "Criar conta"
                  : "Entrar"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline"
              >
                {isSignUp
                  ? "Já tem conta? Fazer login"
                  : "Não tem conta? Cadastre-se"}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 gradient-bg items-center justify-center" />
      </div>
    </>
  );
};

export default Login;
