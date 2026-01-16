type AppointmentStatus = "confirmado" | "pendente" | "concluido" | "cancelado";

type Appointment = {
  id: string;
  clinica: string;
  servico: string;
  data: string; // ex: "22/01/2026"
  hora: string; // ex: "14:30"
  endereco?: string;
  status: AppointmentStatus;
};

const statusMeta: Record<
  AppointmentStatus,
  { label: string; classes: string }
> = {
  confirmado: {
    label: "Confirmado",
    classes: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  pendente: {
    label: "Pendente",
    classes: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  concluido: {
    label: "Concluído",
    classes: "bg-slate-50 text-slate-700 ring-slate-200",
  },
  cancelado: {
    label: "Cancelado",
    classes: "bg-rose-50 text-rose-700 ring-rose-200",
  },
};

const mockAgendamentos: Appointment[] = [
  {
    id: "1",
    clinica: "Radioclim Diagnósticos",
    servico: "Ultrassonografia",
    data: "22/01/2026",
    hora: "14:30",
    endereco: "Av. Exemplo, 123 — Centro",
    status: "confirmado",
  },
  {
    id: "2",
    clinica: "Unianálises",
    servico: "Exame Laboratorial",
    data: "26/01/2026",
    hora: "08:20",
    endereco: "Rua Exemplo, 45 — Catolé",
    status: "pendente",
  },
];

function formatProximo(agendamentos: Appointment[]) {
  if (!agendamentos.length) return null;
  // Mock: assume o primeiro como próximo. Depois você ordena por data/hora com dados reais.
  const a = agendamentos[0];
  return `${a.data} às ${a.hora} • ${a.servico}`;
}

const Agendamentos = () => {
  const agendamentos = mockAgendamentos; // troque por dados do Supabase depois

  const proximo = formatProximo(agendamentos);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Agendamentos
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Gerencie seus atendimentos médicos de forma simples e rápida.
        </p>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ação rápida</p>
              <h2 className="text-lg font-semibold mt-1">Novo agendamento</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Agende consultas, exames e serviços disponíveis na rede conveniada.
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-teal-50 flex items-center justify-center">
              <span className="text-teal-700 font-bold">+</span>
            </div>
          </div>

          <button className="mt-4 w-full rounded-2xl bg-teal-600 text-white py-2.5 text-sm font-semibold hover:bg-teal-700 transition">
            Agendar agora
          </button>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Próximo atendimento</p>
          <h2 className="text-lg font-semibold mt-1">
            {proximo ? "Confirmado/Em andamento" : "Sem agendamentos"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {proximo
              ? proximo
              : "Você ainda não possui atendimentos marcados."}
          </p>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 rounded-2xl border py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
              Ver detalhes
            </button>
            <button className="flex-1 rounded-2xl border py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
              Histórico
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Rede conveniada</p>
          <h2 className="text-lg font-semibold mt-1">Parceiros & serviços</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Consulte clínicas, exames e serviços disponíveis para agendamento.
          </p>
          <button className="mt-4 w-full rounded-2xl border py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
            Ver parceiros
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Meus agendamentos</h3>
            <div className="flex gap-2">
              <button className="rounded-2xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                Filtrar
              </button>
              <button className="rounded-2xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50 transition">
                Ordenar
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize status, detalhes e ações rápidas para cada atendimento.
          </p>
        </div>

        {agendamentos.length === 0 ? (
          <div className="p-8 md:p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-3xl bg-teal-50 flex items-center justify-center">
              <span className="text-teal-700 font-bold">📅</span>
            </div>
            <h4 className="mt-4 text-lg font-semibold">
              Você ainda não possui agendamentos.
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Agende consultas, exames e serviços disponíveis na rede conveniada
              Radioclim Saúde.
            </p>
            <button className="mt-5 rounded-2xl bg-teal-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-teal-700 transition">
              Agendar meu primeiro atendimento
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {agendamentos.map((a) => (
              <div key={a.id} className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{a.clinica}</p>
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                          statusMeta[a.status].classes,
                        ].join(" ")}
                      >
                        {statusMeta[a.status].label}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">
                      Serviço: <span className="text-foreground">{a.servico}</span>
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      Data: <span className="text-foreground">{a.data}</span> •{" "}
                      Hora: <span className="text-foreground">{a.hora}</span>
                    </p>

                    {a.endereco ? (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        Endereço:{" "}
                        <span className="text-foreground">{a.endereco}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <button className="rounded-2xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
                      Ver detalhes
                    </button>
                    <button className="rounded-2xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
                      Reagendar
                    </button>
                    <button className="rounded-2xl bg-rose-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-rose-700 transition">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agendamentos;
