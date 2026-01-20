import { useState } from "react";

export default function ValidarCartao() {
  const [cardNumber, setCardNumber] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function validar() {
    setLoading(true);
    setResultado(null);

    const res = await fetch(
      "https://SEU-PROJETO.supabase.co/functions/v1/validate-card",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_number: cardNumber }),
      }
    );

    const data = await res.json();
    setResultado(data);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Validar Cartão</h1>

      <input
        type="text"
        placeholder="Número do cartão"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className="w-full border rounded-xl px-4 py-2"
      />

      <button
        onClick={validar}
        disabled={loading}
        className="w-full bg-teal-600 text-white rounded-xl py-2"
      >
        {loading ? "Validando..." : "Validar"}
      </button>

      {resultado && (
        <div className="border rounded-xl p-4">
          {resultado.valid ? (
            <>
              <p className="text-green-600 font-bold">✅ CARTÃO VÁLIDO</p>
              <p>Cliente: {resultado.nome}</p>
              <p>Validade: {resultado.validade}</p>
            </>
          ) : (
            <p className="text-red-600 font-bold">
              ❌ {resultado.reason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
