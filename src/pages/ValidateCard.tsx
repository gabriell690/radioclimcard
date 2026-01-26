import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ValidateCard() {
  const [params] = useSearchParams();
  const token = params.get("token");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    fetch(
      `https://SEU-PROJETO.supabase.co/functions/v1/validate-card?token=${token}`
    )
      .then((res) => res.json())
      .then(setResult)
      .catch(() => setResult({ valid: false }));
  }, [token]);

  if (!token) return <h1>Token inválido</h1>;
  if (!result) return <h1>Validando...</h1>;

  return result.valid ? (
    <div style={{ color: "green", padding: 40 }}>
      <h1>✅ CARTÃO VÁLIDO</h1>
      <p>Cliente: {result.nome}</p>
      <p>Validade: {result.validade}</p>
    </div>
  ) : (
    <div style={{ color: "red", padding: 40 }}>
      <h1>❌ CARTÃO INVÁLIDO</h1>
      <p>{result.reason}</p>
    </div>
  );
}
