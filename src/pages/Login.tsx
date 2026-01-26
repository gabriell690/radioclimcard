import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function formatCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  if (d.length <= 3) return p1;
  if (d.length <= 6) return `${p1}.${p2}`;
  if (d.length <= 9) return `${p1}.${p2}.${p3}`;
  return `${p1}.${p2}.${p3}-${p4}`;
}

function formatPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  const ddd = d.slice(0, 2);

  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${ddd}) ${d.slice(2)}`;

  // 10 dígitos: (11) 9999-8888
  if (d.length <= 10) {
    return `(${ddd}) ${d.slice(2, 6)}-${d.slice(6, 10)}`;
  }

  // 11 dígitos: (11) 99999-8888
  return `(${ddd}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

/**
 * Validação real de CPF
 * - Remove não-dígitos
 * - Bloqueia CPFs com todos os dígitos iguais
 * - Calcula os 2 dígitos verificadores
 */
function isValidCPF(cpf: string) {
  const c = onlyDigits(cpf);

  if (c.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(c)) return false; // 00000000000, 11111111111 etc.

  const nums = c.split("").map((x) => Number(x));

  // digito 1
  let sum1 = 0;
  for (let i = 0; i < 9; i++) sum1 += nums[i] * (10 - i);
  let d1 = (sum1 * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== nums[9]) return false;

  // digito 2
  let sum2 = 0;
  for (let i = 0; i < 10; i++) sum2 += nums[i] * (11 - i);
  let d2 = (sum2 * 10) % 11;
  if (d2 === 10) d2 = 0;
  if (d2 !== nums[10]) return false;

  return true;
}

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    cpf: "",
    telefone: "",
  });

  const envOk = useMemo(() => {
    // Ajuda a identificar “funciona local mas não no ar” (env vars faltando no deploy)
    // Não quebra a build, só previne “Processando…” sem feedback.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    return Boolean(url && key);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!envOk) {
      toast({
        title: "Configuração ausente no deploy",
        description:
          "Faltam as variáveis VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY no Netlify.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isSignUp) {
        const cpfDigits = onlyDigits(formData.cpf);
        const telDigits = onlyDigits(formData.telefone);

        if (!formData.name.trim()) {
          throw new Error("Informe seu nome.");
        }

        if (!isValidCPF(cpfDigits)) {
          throw new Error("CPF inválido. Verifique e tente novamente.");
        }

        if (telDigits.length < 10 || telDigits.length > 11) {
          throw new Error("Telefone inválido. Use DDD + número (10 ou 11 dígitos).");
        }

        // 1) cria usuário no auth
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name.trim(),
            },
          },
        });

        if (error) throw error;

        const userId = data.user?.id;
        if (!userId) {
          // Em alguns cenários, o signUp pode depender de confirmação por email
          // e ainda assim retornar user; se não retornar, avisa.
          throw new Error(
            "Cadastro criado, mas não retornou o usuário. Verifique se o Supabase exige confirmação por e-mail."
          );
        }

        // 2) salva perfil (CPF + telefone) em profiles
        const { error: profErr } = await supabase.from("profiles").upsert(
          {
            id: userId,
            nome: formData.name.trim(),
            role: "client",
            status: "active",
            cpf: cpfDigits,
            telefone: telDigits,
          },
          { onConflict: "id" }
        );

        if (profErr) {
          // Conta existe, mas perfil falhou — não trava o usuário, só avisa
          console.error("profiles upsert error:", profErr);
          toast({
            title: "Conta criada, mas perfil não foi salvo",
            description:
              "CPF/Telefone não foram gravados. Confira policies (RLS) de profiles e tente novamente.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Cadastro realizado!",
            description: "Conta criada com sucesso. Faça login para continuar.",
          });
        }

        setIsSignUp(false);
      } else {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Erro",
        description: err?.message ?? "Erro ao autenticar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      setFormData((prev) => ({ ...prev, cpf: formatCPF(value) }));
      return;
    }

    if (name === "telefone") {
      setFormData((prev) => ({ ...prev, telefone: formatPhone(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Digite um CPF válido (com dígitos verificadores).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      inputMode="tel"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label>Senha</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processando..." : isSignUp ? "Criar conta" : "Entrar"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp((v) => !v)}
                className="text-primary hover:underline"
              >
                {isSignUp ? "Já tem conta? Fazer login" : "Não tem conta? Cadastre-se"}
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