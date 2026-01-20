import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Pedido = {
  id: string;
  user_id: string | null;
  plano_id: string | null;
  valor_total: number;
  status: string | null;
  quantidade_colaboradores: number | null;
  created_at: string | null;
  observacoes: string | null;
};

const STATUS_OPTIONS = [
  "pendente",
  "aguardando_pagamento",
  "pago",
  "aprovado",
  "cancelado",
] as const;

export default function PedidosAdmin() {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [search, setSearch] = useState<string>("");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  async function fetchPedidos() {
    setLoading(true);

    // Query base
    let q = supabase
      .from("pedidos")
      .select(
        "id,user_id,plano_id,valor_total,status,quantidade_colaboradores,created_at,observacoes"
      )
      .order("created_at", { ascending: false });

    // filtro por status (se aplicável)
    if (statusFilter !== "todos") {
      q = q.eq("status", statusFilter);
    }

    // busca simples por ID / user_id (client-side, para não depender de ilike em uuid)
    const { data, error } = await q.limit(200);

    if (!error && data) {
      const normalized = (data as Pedido[]).map((p) => ({
        ...p,
        valor_total: Number(p.valor_total ?? 0),
      }));

      setPedidos(normalized);
    } else {
      setPedidos([]);
      // Você pode substituir por toast caso esteja usando
      console.error("Erro ao carregar pedidos:", error);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const pedidosFiltrados = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return pedidos;

    return pedidos.filter((p) => {
      return (
        p.id?.toLowerCase().includes(s) ||
        (p.user_id ?? "").toLowerCase().includes(s) ||
        (p.status ?? "").toLowerCase().includes(s)
      );
    });
  }, [pedidos, search]);

  async function updateStatus(pedidoId: string, newStatus: string) {
    setSavingId(pedidoId);

    const { error } = await supabase
      .from("pedidos")
      .update({ status: newStatus })
      .eq("id", pedidoId);

    if (error) {
      console.error("Erro ao atualizar status:", error);
      setSavingId(null);
      return;
    }

    // atualiza localmente sem refetch completo
    setPedidos((prev) =>
      prev.map((p) => (p.id === pedidoId ? { ...p, status: newStatus } : p))
    );

    setSavingId(null);
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie cobranças, status e acompanhe a operação.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            >
              <option value="todos">Todos</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">
              Buscar (id / user_id / status)
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ex: pendente, 3fc9..., 50f1..."
              className="h-10 w-full sm:w-80 rounded-xl border bg-white px-3 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">&nbsp;</label>
            <button
              onClick={fetchPedidos}
              className="h-10 rounded-xl border bg-white px-4 text-sm font-semibold hover:bg-muted"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Carregando..."
              : `${pedidosFiltrados.length} pedido(s) encontrado(s)`}
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Criado em</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={7}>
                    Carregando pedidos...
                  </td>
                </tr>
              ) : pedidosFiltrados.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={7}>
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[240px]">{p.id}</span>
                        {p.quantidade_colaboradores != null && (
                          <span className="text-xs text-muted-foreground">
                            Colaboradores: {p.quantidade_colaboradores}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="truncate block max-w-[220px]">
                        {p.user_id ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="truncate block max-w-[220px]">
                        {p.plano_id ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {formatBRL(p.valor_total)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                          badgeClass(p.status ?? ""),
                        ].join(" ")}
                      >
                        {p.status ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {p.created_at ? formatDate(p.created_at) : "—"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={p.status ?? ""}
                          onChange={(e) => updateStatus(p.id, e.target.value)}
                          disabled={savingId === p.id}
                          className="h-9 rounded-xl border bg-white px-2 text-xs"
                        >
                          <option value="" disabled>
                            Selecione
                          </option>
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => updateStatus(p.id, "pago")}
                          disabled={savingId === p.id}
                          className="h-9 rounded-xl border bg-white px-3 text-xs font-semibold hover:bg-muted disabled:opacity-60"
                        >
                          {savingId === p.id ? "Salvando..." : "Marcar pago"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t text-xs text-muted-foreground">
          Dica: ao marcar como <b>pago</b>, o KPI de faturamento do mês (dashboard)
          deve atualizar após recarregar.
        </div>
      </div>
    </div>
  );
}

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR");
}

function badgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === "pago" || s === "aprovado") return "bg-emerald-100 text-emerald-800";
  if (s === "pendente" || s === "aguardando_pagamento")
    return "bg-amber-100 text-amber-800";
  if (s === "cancelado") return "bg-rose-100 text-rose-800";
  return "bg-slate-100 text-slate-700";
}
