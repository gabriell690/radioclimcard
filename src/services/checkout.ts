import { supabase } from "@/lib/supabase";

export async function criarPedido(pacienteId: string, planoId: string, valor: number) {
  const { data, error } = await supabase
    .from("pedidos")
    .insert([
      {
        paciente_id: pacienteId,
        plano_id: planoId,
        valor,
        status: "pendente",
        forma_pagamento: "pix",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
