import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Plano = {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  tipo: "individual" | "familia" | "empresarial";
  assessoria_juridica: boolean;
  dependentes_max?: number | null;
  valor_por_colaborador?: boolean | null;
};

type Dependente = {
  nome: string;
  parentesco: string; // "Conjuge" | "Filho" etc
  data_nascimento?: string; // yyyy-mm-dd
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const state = (location.state || {}) as {
    planoId?: string;
    nome?: string;
    valor?: number;
  };

  const [plano, setPlano] = useState<Plano | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // empresarial
  const [qtdColaboradores, setQtdColaboradores] = useState<number>(10);

  // familia
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [depNome, setDepNome] = useState("");
  const [depParentesco, setDepParentesco] = useState("Filho");
  const [depNascimento, setDepNascimento] = useState("");

  // Carrega plano pelo ID (fonte de verdade)
  useEffect(() => {
    async function loadPlano() {
      try {
        setLoading(true);

        const planoId = state.planoId;
        if (!planoId) {
          // Se alguém cair direto na rota sem state
          navigate("/planos");
          return;
        }

        const { data, error } = await supabase
          .from("planos")
          .select(
            "id, nome, descricao, valor, tipo, assessoria_juridica, dependentes_max, valor_por_colaborador"
          )
          .eq("id", planoId)
          .single();

        if (error) {
          console.error(error);
          navigate("/planos");
          return;
        }

        setPlano(data as Plano);
      } finally {
        setLoading(false);
      }
    }

    loadPlano();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.planoId]);

  const valorTotal = useMemo(() => {
    if (!plano) return 0;
    if (plano.tipo === "empresarial") {
      const qtd = Number.isFinite(qtdColaboradores) ? qtdColaboradores : 0;
      return Number(plano.valor) * Math.max(0, qtd);
    }
    return Number(plano.valor);
  }, [plano, qtdColaboradores]);

  function addDependente() {
    if (!plano || plano.tipo !== "familia") return;

    const max = plano.dependentes_max ?? 0;
    if (max && dependentes.length >= max) return;

    if (!depNome.trim()) return;

    setDependentes((prev) => [
      ...prev,
      {
        nome: depNome.trim(),
        parentesco: depParentesco,
        data_nascimento: depNascimento || undefined,
      },
    ]);

    setDepNome("");
    setDepNascimento("");
    setDepParentesco("Filho");
  }

  function removeDependente(index: number) {
    setDependentes((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCriarPedido() {
    if (!plano) return;

    // Regras mínimas
    if (plano.tipo === "empresarial") {
      if (!qtdColaboradores || qtdColaboradores < 1) return;
    }

    if (plano.tipo === "familia") {
      // Você pode permitir sem dependentes (cadastrar depois),
      // mas aqui já deixei um mínimo opcional.
      // Se quiser obrigar pelo menos 1 dependente, descomente:
      // if (dependentes.length < 1) return;
      const max = plano.dependentes_max ?? null;
      if (max && dependentes.length > max) return;
    }

    setSubmitting(true);
    try {
      // 1) Cria pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert({
          user_id: user?.id ?? null,
          plano_id: plano.id,
          valor_total: valorTotal,
          status: "pendente",
          quantidade_colaboradores:
            plano.tipo === "empresarial" ? qtdColaboradores : null,
          observacoes:
            plano.assessoria_juridica
              ? "Plano com assessoria jurídica preventiva e orientativa."
              : null,
        })
        .select("id")
        .single();

      if (pedidoError) {
        console.error(pedidoError);
        return;
      }

      // 2) Se família, grava dependentes (opcional)
      if (plano.tipo === "familia" && dependentes.length > 0) {
        const payload = dependentes.map((d) => ({
          pedido_id: pedido.id,
          nome: d.nome,
          parentesco: d.parentesco,
          data_nascimento: d.data_nascimento || null,
        }));

        const { error: depError } = await supabase
          .from("dependentes")
          .insert(payload);

        if (depError) {
          console.error(depError);
          // Não bloqueia o fluxo: o pedido já existe.
        }
      }

      // 3) Vai para tela de pendência/PIX (placeholder por enquanto)
      navigate("/checkout/pendente", {
        state: {
          pedidoId: pedido.id,
          planoNome: plano.nome,
          valorTotal,
          tipo: plano.tipo,
          qtdColaboradores: plano.tipo === "empresarial" ? qtdColaboradores : null,
        },
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Radioclim Card</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {loading && (
              <p className="text-center text-muted-foreground">Carregando...</p>
            )}

            {!loading && !plano && (
              <p className="text-center text-red-500">
                Plano inválido. Volte e escolha novamente.
              </p>
            )}

            {!loading && plano && (
              <div className="max-w-xl mx-auto rounded-3xl bg-white shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-primary font-bold">■</span>
                  </div>
                  <h1 className="text-2xl font-bold">Finalizar Assinatura</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Você está a um passo de ativar seu Radioclim Card
                  </p>
                </div>

                <div className="rounded-2xl border p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Plano escolhido
                    </span>
                    <span className="font-semibold">{plano.nome}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      Valor mensal
                    </span>
                    <span className="font-bold">
                      R$ {valorTotal.toFixed(2)}
                      {plano.tipo === "empresarial" ? " (total)" : ""}
                    </span>
                  </div>

                  {plano.tipo === "empresarial" && (
                    <div className="mt-4">
                      <label className="text-sm text-muted-foreground">
                        Quantidade de colaboradores
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={qtdColaboradores}
                        onChange={(e) => setQtdColaboradores(Number(e.target.value))}
                        className="mt-2 w-full rounded-xl border px-3 py-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        R$ {Number(plano.valor).toFixed(2)} por colaborador.
                      </p>
                    </div>
                  )}

                  {plano.assessoria_juridica && (
                    <div className="mt-4 text-sm">
                      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1">
                        Assessoria jurídica inclusa
                      </span>
                      <p className="text-xs text-muted-foreground mt-2">
                        Assessoria preventiva e orientativa. Sem acompanhamento
                        processual.
                      </p>
                    </div>
                  )}

                  {plano.tipo === "familia" && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2">
                        Dependentes (cônjuge e filhos)
                      </p>

                      <div className="grid grid-cols-1 gap-2">
                        <input
                          value={depNome}
                          onChange={(e) => setDepNome(e.target.value)}
                          placeholder="Nome do dependente"
                          className="rounded-xl border px-3 py-2"
                        />

                        <select
                          value={depParentesco}
                          onChange={(e) => setDepParentesco(e.target.value)}
                          className="rounded-xl border px-3 py-2"
                        >
                          <option value="Conjuge">Cônjuge</option>
                          <option value="Filho">Filho(a)</option>
                        </select>

                        <input
                          type="date"
                          value={depNascimento}
                          onChange={(e) => setDepNascimento(e.target.value)}
                          className="rounded-xl border px-3 py-2"
                        />

                        <Button
                          type="button"
                          onClick={addDependente}
                          disabled={
                            (plano.dependentes_max ?? 0) > 0 &&
                            dependentes.length >= (plano.dependentes_max ?? 0)
                          }
                        >
                          Adicionar dependente
                        </Button>

                        {(plano.dependentes_max ?? 0) > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Limite: {plano.dependentes_max} dependentes.
                          </p>
                        )}
                      </div>

                      {dependentes.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {dependentes.map((d, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-xl border px-3 py-2"
                            >
                              <div>
                                <p className="text-sm font-medium">{d.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  {d.parentesco}
                                  {d.data_nascimento ? ` • ${d.data_nascimento}` : ""}
                                </p>
                              </div>
                              <button
                                className="text-sm text-red-500"
                                onClick={() => removeDependente(i)}
                              >
                                Remover
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-center text-sm text-muted-foreground mb-4">
                  Pagamento seguro via PIX
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCriarPedido}
                  disabled={submitting}
                >
                  {submitting ? "Gerando pedido..." : "Pagar com PIX"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => navigate("/planos")}
                >
                  Voltar para os Planos
                </Button>

                <p className="text-xs text-muted-foreground mt-6 text-center">
                  Ao continuar, você concorda com os Termos de Uso e Política de
                  Privacidade.
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
