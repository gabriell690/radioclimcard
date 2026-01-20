import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Kpis = {
  clientes_ativos: number;
  faturamento_mes: number;
  total_em_aberto: number;
};

type SerieDia = { dia: string; faturamento: number };

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<Kpis>({
    clientes_ativos: 0,
    faturamento_mes: 0,
    total_em_aberto: 0,
  });

  const [series, setSeries] = useState<SerieDia[]>([]);

  const last30DaysISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  async function fetchKpis() {
    const { data, error } = await supabase.from("admin_kpis").select("*").single();

    if (!error && data) {
      setKpis({
        clientes_ativos: Number(data.clientes_ativos ?? 0),
        faturamento_mes: Number(data.faturamento_mes ?? 0),
        total_em_aberto: Number(data.total_em_aberto ?? 0),
      });
    }
  }

  async function fetchSeries30d() {
    // pega pedidos pagos/aprovados dos últimos 30 dias
    const { data, error } = await supabase
      .from("pedidos")
      .select("created_at, valor_total, status")
      .in("status", ["pago", "aprovado"])
      .gte("created_at", last30DaysISO)
      .order("created_at", { ascending: true })
      .limit(2000);

    if (error) {
      console.error("Erro ao carregar série do gráfico:", error);
      setSeries([]);
      return;
    }

    // agrega por dia (YYYY-MM-DD)
    const map = new Map<string, number>();

    for (const row of data ?? []) {
      const iso = row.created_at as string;
      const day = iso.slice(0, 10); // YYYY-MM-DD
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const v = Number((row as any).valor_total ?? 0);
      map.set(day, (map.get(day) ?? 0) + v);
    }

    // garante os 30 dias completos (mesmo sem pedidos)
    const out: SerieDia[] = [];
    const start = new Date(last30DaysISO);
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dayKey = d.toISOString().slice(0, 10);
      out.push({
        dia: formatDiaBR(dayKey),
        faturamento: map.get(dayKey) ?? 0,
      });
    }

    setSeries(out);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchKpis(), fetchSeries30d()]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="p-6">Carregando dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard (Admin)</h1>
        <p className="text-muted-foreground">Visão geral do Radioclim Card</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Clientes ativos" value={kpis.clientes_ativos} />
        <KpiCard title="Faturamento (mês)" value={formatBRL(kpis.faturamento_mes)} />
        <KpiCard title="Em aberto" value={formatBRL(kpis.total_em_aberto)} />
      </div>

      {/* Gráfico */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">Faturamento diário</p>
          <p className="text-lg font-semibold">Últimos 30 dias</p>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" tickMargin={8} />
              <YAxis tickFormatter={(v) => formatBRLShort(Number(v))} width={80} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => formatBRL(Number(value))}
                labelFormatter={(label) => `Dia: ${label}`}
              />
              <Line type="monotone" dataKey="faturamento" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Considera pedidos com status <b>pago</b> ou <b>aprovado</b>.
        </p>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KpiCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatBRLShort(v: number) {
  // Ex.: R$ 1,2 mil
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)} mi`;
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)} mil`;
  return `R$ ${v.toFixed(0)}`;
}

function formatDiaBR(yyyyMmDd: string) {
  const [y, m, d] = yyyyMmDd.split("-");
  return `${d}/${m}`;
}
