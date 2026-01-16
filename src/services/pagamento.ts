import { supabase } from "@/lib/supabase";

export async function confirmarPagamento(pedidoId: string) {
  const { error: erroPedido } = await supabase
    .from("pedidos")
    .update({ status: "pago" })
    .eq("id", pedidoId);

  if (erroPedido) throw erroPedido;

  const { data: pedido } = await supabase
    .from("pedidos")
    .select("paciente_id, plano_id")
    .eq("id", pedidoId)
    .single();

  const { error: erroAssinatura } = await supabase
    .from("assinaturas")
    .insert([
      {
        paciente_id: pedido?.paciente_id,
        plano_id: pedido?.plano_id,
        status: "ativa",
        proximo_pagamento: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    ]);

  if (erroAssinatura) throw erroAssinatura;
}
