export default function Perfil() {
  // Mock por enquanto (depois vem do Supabase/AuthContext)
  const user = {
    nome: "Gabriel",
    email: "gabriel@email.com",
    plano: "Individual Premium",
    validade: "12/2025",
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Informações da sua conta e do seu cartão.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card do usuário */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
              {user.nome?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold">{user.nome}</h2>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl border p-4">
              <p className="text-xs text-muted-foreground">Plano</p>
              <p className="font-semibold mt-1">{user.plano}</p>
            </div>
            <div className="rounded-2xl border p-4">
              <p className="text-xs text-muted-foreground">Validade</p>
              <p className="font-semibold mt-1">{user.validade}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button className="rounded-2xl bg-teal-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-teal-700 transition">
              Editar dados
            </button>
            <button className="rounded-2xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
              Alterar senha
            </button>
          </div>
        </div>

        {/* Card rápido */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Ações</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão rápida da sua conta.
          </p>

          <div className="mt-4 space-y-2">
            <button className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition text-left">
              Ver meus agendamentos
            </button>
            <button className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition text-left">
              Ver exames
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
