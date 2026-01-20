import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { QRCodeCanvas } from "qrcode.react";

type Role = "client" | "admin";

type Perfil = {
  id: string;
  nome: string | null;
  role: Role;
  card_number: string | null;
  card_valid_until: string | null;
  validation_token: string | null;
};

export default function MeuCard() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [temPlanoAtivo, setTemPlanoAtivo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarQr, setMostrarQr] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;
        if (!user) throw new Error("Usuário não autenticado");

        const { data: perfilData } = await supabase
          .from("perfis")
          .select("id,nome,role,card_number,card_valid_until,validation_token")
          .eq("id", user.id)
          .maybeSingle();

        const { data: pedidosPagos } = await supabase
          .from("pedidos")
          .select("id")
          .eq("user_id", user.id)
          .in("status", ["pago", "aprovado"])
          .limit(1);

        if (!mounted) return;

        setPerfil(perfilData as Perfil);
        setTemPlanoAtivo((pedidosPagos?.length ?? 0) > 0);
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (!mounted) return;
        setErro(e?.message ?? "Erro ao carregar cartão");
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const nomeExibicao = useMemo(() => {
    const n = perfil?.nome?.trim();
    return n && n.length > 0 ? n : "Cliente";
  }, [perfil?.nome]);

  if (loading) return <div className="p-6">Carregando...</div>;

  if (erro) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Meu Card</h1>
        <p className="text-red-600 mt-2">{erro}</p>
      </div>
    );
  }

  if (perfil?.role === "admin") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Área Administrativa</h1>
        <p className="text-muted-foreground">
          O cartão é exibido apenas para clientes.
        </p>
      </div>
    );
  }

  const cardNumero = perfil?.card_number
    ? formatCardNumber(perfil.card_number)
    : "Aguardando ativação";

  const cardValidade = perfil?.card_valid_until
    ? formatMMYYYY(perfil.card_valid_until)
    : "—";

  const qrUrl = perfil?.validation_token
    ? `http://localhost:5173/validate?token=${perfil.validation_token}`
    : "";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {nomeExibicao}!</h1>
          <p className="text-muted-foreground">
            Bem-vindo(a) à sua área do Radioclim Card.
          </p>
        </div>

        {!temPlanoAtivo && (
          <div className="rounded-xl border bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-900">
              Período de teste
            </p>
            <p className="text-xs text-amber-800">
              Finalize o pagamento para ativar os benefícios.
            </p>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Kpi title="Consultas realizadas" value={0} />
        <Kpi title="Exames disponíveis" value={0} />
        <Kpi title="Economia total" value="R$ 0,00" />
        <Kpi title="Dependentes" value={0} />
      </div>

      {/* Cartão */}
      <div className="rounded-2xl bg-teal-600 p-6 text-white max-w-xl">
        <p className="text-sm opacity-90">Cartão de Benefícios</p>
        <p className="text-2xl font-semibold mt-2">{cardNumero}</p>

        <div className="flex justify-between mt-6 text-sm">
          <div>
            <p className="opacity-80">Titular</p>
            <p className="font-medium">{nomeExibicao}</p>
          </div>
          <div className="text-right">
            <p className="opacity-80">Validade</p>
            <p className="font-medium">{cardValidade}</p>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3">
        <button
          disabled={!temPlanoAtivo}
          className="border rounded-xl px-4 py-2 disabled:opacity-50"
          onClick={() => setMostrarQr(true)}
        >
          Ver QR Code
        </button>

        <button
          disabled={!temPlanoAtivo}
          className="bg-teal-600 text-white rounded-xl px-4 py-2 disabled:opacity-50"
        >
          Agendar Consulta
        </button>
      </div>

      {/* MODAL QR CODE */}
      {mostrarQr && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 space-y-4 w-[300px]">
            <h2 className="text-lg font-bold text-center">
              Apresente na clínica
            </h2>

            <div className="flex justify-center">
              <QRCodeCanvas value={qrUrl} size={200} />
            </div>

            <button
              className="w-full border rounded-xl py-2"
              onClick={() => setMostrarQr(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helpers */

function formatCardNumber(n: string) {
  return n.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
}

function formatMMYYYY(dateISO: string) {
  const d = new Date(dateISO);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Kpi({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
