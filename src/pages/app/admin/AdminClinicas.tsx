import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Clinica = {
  id: string;
  nome: string;
  cnpj: string | null;
  ativo: boolean;
};

export default function AdminClinicas() {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  async function carregarClinicas() {
    setLoading(true);

    const { data, error } = await supabase
      .from("clinicas")
      .select("id,nome,cnpj,ativo")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setClinicas(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarClinicas();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clínicas Credenciadas</h1>
          <p className="text-muted-foreground">
            Gerencie as clínicas conveniadas ao sistema
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700"
        >
          + Nova Clínica
        </button>
      </div>

      {/* Lista */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Clínica</th>
              <th className="p-3 text-left">CNPJ</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  Carregando...
                </td>
              </tr>
            )}

            {!loading && clinicas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  Nenhuma clínica cadastrada
                </td>
              </tr>
            )}

            {clinicas.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-medium">{c.nome}</td>
                <td className="p-3">{c.cnpj ?? "-"}</td>
                <td className="p-3">
                  {c.ativo ? (
                    <span className="text-green-600 font-semibold">Ativa</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inativa</span>
                  )}
                </td>
                <td className="p-3">
                  <button className="text-sm text-blue-600">
                    Gerenciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nova Clínica */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-6">
            <h2 className="text-xl font-bold">Nova Clínica Credenciada</h2>

            <form
             onSubmit={async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  const payload = {
    nome: formData.get("nome"),
    email: formData.get("email"),
    cnpj: formData.get("cnpj"),
    ativo: formData.get("ativo") === "true",
  };

  const { error } = await supabase.functions.invoke("create-clinic", {
    body: payload,
  });

  if (error) {
    alert("Erro ao cadastrar clínica");
    return;
  }

  setModalAberto(false);
  carregarClinicas();
}}

              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Nome da Clínica</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="Clínica Exemplo"
                />
              </div>

              <div>
                <label className="text-sm font-medium">CNPJ</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="00.000.000/0001-00"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email de Acesso</label>
                <input
                  type="email"
                  required
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="contato@clinica.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select className="w-full border rounded-lg p-2 mt-1">
                  <option value="true">Ativa</option>
                  <option value="false">Inativa</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white"
                >
                  Cadastrar Clínica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
