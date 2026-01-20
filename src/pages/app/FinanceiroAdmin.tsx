import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Pedido = {
  id: string;
  user_id: string | null;
  valor_total: number;
  status: string | null;
  created_at: string | null;
};

const STATUS_PAGOS = ["pago", "aprovado"];
const STATUS_ABERTO = ["pendente", "aguardando_pagamento"];

function startOfMonthISO() {
  const d = new Date();
  const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
  return start.toISOString();
}

function nowISO() {
  return new Date().toISOString();
}

export default function FinanceiroAdmin() {
  const [loading, setLoading] = useState(true);

  // período (default: mês atual)
  const [dateFrom, setDateFrom] = useState<string>(() => startOfMonthISO().slice(0, 10));
  const [dateTo, setDateTo] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [kpis, setKpis] = useState({
    faturamentoPeriodo: 0,
    emAbertoPeriodo: 0,
    qtdPagos: 0,
    qtdAbertos: 0,
  });

  const dateFromISO = useMemo(() => `${dateFrom}T00:00:00.000Z`, [dateFrom]);
  const dateToISO = useMemo(() => `${dateTo}T23:59:59.999Z`, [dateTo]);

  async function fetchFinanceiro() {
    setLoading(true);

    let q = supabase
      .from("pedidos")
      .select("id,user_id,valor_total,status,created_at")
      .gte("created_at", dateFromISO)
      .lte("created_at", dateToISO)
      .order("created_at", { ascending: false });

    if (statusFilter !== "todos") {
      q = q.eq("status", statusFilter);
    }

    const { data, error } = await q.limit(500);

    if (error) {
      console.error("Erro ao carregar financeiro:", error);
      setPedidos([]);
      setKpis({ faturamentoPeriodo: 0, emAbertoPeriodo: 0, qtdPagos: 0, qtdAbertos: 0 });
      setLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (data ?? []).map((p: any) => ({
      id: p.id,
      user_id: p.user_id,
      valor_total: Number(p.valor_total ?? 0),
      status: p.status,
      created_at: p.created_at,
    })) as Pedido[];

    setPedidos(rows);

    // KPIs do período (calculado no front)
    const pagos = rows.filter((r) => STATUS_PAGOS.includes((r.status ?? "").toLowerCase()));
    const abertos = rows.filter((r) => STATUS_ABERTO.includes((r.status ?? "").toLowerCase()));

    const faturamentoPeriodo = pagos.reduce((acc, r) => acc + (r.valor_total ?? 0), 0);
    const emAbertoPeriodo = abertos.reduce((acc, r) => acc + (r.valor_total ?? 0), 0);

    setKpis({
      faturamentoPeriodo,
      emAbertoPeriodo,
      qtdPagos: pagos.length,
      qtdAbertos: abertos.length,
    });

    setLoading(false);
  }

  useEffect(() => {
    fetchFinanceiro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFromISO, dateToISO, statusFilter]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe faturamento, valores em aberto e relatórios por período.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">De</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">Até</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            >
              <option value="todos">Todos</option>
              <option value="pago">pago</option>
              <option value="aprovado">aprovado</option>
              <option value="pendente">pendente</option>
              <option value="aguardando_pagamento">aguardando_pagamento</option>
              <option value="cancelado">cancelado</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">&nbsp;</label>
            <button
              onClick={fetchFinanceiro}
              className="h-10 rounded-xl border bg-white px-4 text-sm font-semibold hover:bg-muted"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Faturamento (período)" value={formatBRL(kpis.faturamentoPeriodo)} />
        <KpiCard title="Em aberto (período)" value={formatBRL(kpis.emAbertoPeriodo)} />
        <KpiCard title="Pagos (qtd.)" value={kpis.qtdPagos} />
        <KpiCard title="Em aberto (qtd.)" value={kpis.qtdAbertos} />
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Carregando..." : `${pedidos.length} pedido(s) no período`}
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Criado em</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={5}>
                    Carregando...
                  </td>
                </tr>
              ) : pedidos.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={5}>
                    Nenhum dado no período selecionado.
                  </td>
                </tr>
              ) : (
                pedidos.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      <span className="truncate block max-w-[260px]">{p.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="truncate block max-w-[240px]">{p.user_id ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatBRL(p.valor_total)}</td>
                    <td className="px-4 py-3">
                      <span className={"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold " + badgeClass(p.status ?? "")}>
                        {p.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.created_at ? formatDate(p.created_at) : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t text-xs text-muted-foreground">
          Observação: “Faturamento” considera status <b>pago/aprovado</b>. “Em aberto” considera
          <b> pendente/aguardando_pagamento</b>.
        </div>
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

function badgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === "pago" || s === "aprovado") return "bg-emerald-100 text-emerald-800";
  if (s === "pendente" || s === "aguardando_pagamento") return "bg-amber-100 text-amber-800";
  if (s === "cancelado") return "bg-rose-100 text-rose-800";
  return "bg-slate-100 text-slate-700";
}
