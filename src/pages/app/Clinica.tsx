import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Clinica() {
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function validarCartao() {
    setLoading(true);
    setErro(null);
    setResultado(null);

    const numeroLimpo = cardNumber.replace(/\s/g, "");

    const { data, error } = await supabase.functions.invoke(
      "validate-card",
      {
        body: { card_number: numeroLimpo },
      }
    );

    if (error) {
      setErro("Erro ao validar cartão");
      setLoading(false);
      return;
    }

    if (!data?.valido) {
      setErro(data?.mensagem || "Cartão inválido");
      setLoading(false);
      return;
    }

    setResultado(data);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Validar Cartão</h1>
      <p className="text-muted-foreground">
        Informe o número do cartão do paciente
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium">Número do Cartão</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="7890 4636 9359 1065"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <button
        onClick={validarCartao}
        disabled={loading || cardNumber.length < 16}
        className="w-full bg-teal-600 text-white py-3 rounded-xl disabled:opacity-50"
      >
        {loading ? "Validando..." : "Validar Cartão"}
      </button>

      {/* Resultado */}
      {erro && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {erro}
        </div>
      )}

      {resultado && (
        <div className="bg-green-100 p-4 rounded-lg space-y-2">
          <p className="font-bold text-green-700">Cartão válido</p>
          <p><strong>Nome:</strong> {resultado.nome}</p>
          <p><strong>Plano:</strong> {resultado.plano}</p>
          <p><strong>Validade:</strong> {resultado.validade}</p>
        </div>
      )}
    </div>
  );
}
