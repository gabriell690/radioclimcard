type Service = {
  id: string;
  categoria: string;
  nome: string;
  descricao?: string;
  destaque?: boolean;
};

const mockServicos: Service[] = [
  {
    id: "1",
    categoria: "Consultas",
    nome: "Clínico Geral",
    descricao: "Atendimento inicial e encaminhamentos.",
    destaque: true,
  },
  {
    id: "2",
    categoria: "Exames",
    nome: "Ultrassonografia",
    descricao: "Exames por imagem com agendamento.",
  },
  {
    id: "3",
    categoria: "Laboratório",
    nome: "Exames laboratoriais",
    descricao: "Coletas e análises com parceiros conveniados.",
  },
  {
    id: "4",
    categoria: "Ótica",
    nome: "Descontos em armações e lentes",
    descricao: "Benefícios em óticas parceiras.",
  },
];

export default function Servicos() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Serviços
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Confira os serviços disponíveis na rede conveniada.
        </p>
      </div>

      <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Lista de serviços</h2>
            <span className="text-sm text-muted-foreground">
              {mockServicos.length} itens
            </span>
          </div>
        </div>

        <div className="divide-y">
          {mockServicos.map((s) => (
            <div key={s.id} className="p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{s.nome}</p>
                    {s.destaque ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset bg-teal-50 text-teal-700 ring-teal-200">
                        Destaque
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    Categoria: <span className="text-foreground">{s.categoria}</span>
                  </p>

                  {s.descricao ? (
                    <p className="text-sm text-muted-foreground mt-2">
                      {s.descricao}
                    </p>
                  ) : null}
                </div>

                <button className="rounded-2xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
