import { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  CalendarDays,
  ClipboardList,
  Download,
  Heart,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AppointmentStatus = "confirmado" | "agendado" | "pendente";

type DashboardData = {
  user: {
    nome: string;
    plano: string;
  };
  card: {
    numero: string; // exibido formatado
    numeroRaw: string; // para qr/pix etc
    titular: string;
    validade: string;
    status: "Ativo" | "Pendente" | "Bloqueado";
  };
  kpis: {
    consultasRealizadas: number;
    examesDisponiveis: number;
    economiaTotal: number; // em reais
    dependentes: number;
  };
  proximosAgendamentos: Array<{
    id: string;
    especialidade: string;
    profissional: string;
    data: string; // dd/mm/aaaa
    hora: string; // hh:mm
    status: AppointmentStatus;
  }>;
  examesRecentes: Array<{
    id: string;
    nome: string;
    data: string; // dd/mm/aaaa
    status: "Disponível" | "Em análise";
  }>;
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function statusBadge(status: AppointmentStatus) {
  const base = "rounded-full px-3 py-1 text-xs font-semibold";
  if (status === "confirmado") return <span className={cn(base, "bg-emerald-100 text-emerald-800")}>Confirmado</span>;
  if (status === "agendado") return <span className={cn(base, "bg-sky-100 text-sky-800")}>Agendado</span>;
  return <span className={cn(base, "bg-amber-100 text-amber-800")}>Pendente</span>;
}

export default function MeuCard() {
  const [showQr, setShowQr] = useState(false);

  // ✅ MOCK (trocar por Supabase depois)
  const data: DashboardData = useMemo(
    () => ({
      user: {
        nome: "Olá, Maria!",
        plano: "Plano Família",
      },
      card: {
        numero: "7890 1234 5678 9012",
        numeroRaw: "7890123456789012",
        titular: "MARIA SILVA SANTOS",
        validade: "12/2025",
        status: "Ativo",
      },
      kpis: {
        consultasRealizadas: 12,
        examesDisponiveis: 3,
        economiaTotal: 847,
        dependentes: 3,
      },
      proximosAgendamentos: [
        {
          id: "apt-1",
          especialidade: "Cardiologista",
          profissional: "Dr. Roberto Silva",
          data: "15/12/2026",
          hora: "09:00",
          status: "confirmado",
        },
        {
          id: "apt-2",
          especialidade: "Ultrassonografia",
          profissional: "Dra. Ana Paula",
          data: "18/12/2026",
          hora: "14:30",
          status: "agendado",
        },
        {
          id: "apt-3",
          especialidade: "Clínico Geral",
          profissional: "Dr. Carlos Mendes",
          data: "20/12/2026",
          hora: "10:00",
          status: "agendado",
        },
      ],
      examesRecentes: [
        { id: "ex-1", nome: "Hemograma Completo", data: "01/12/2026", status: "Disponível" },
        { id: "ex-2", nome: "Ultrassonografia Abdominal", data: "28/11/2026", status: "Disponível" },
        { id: "ex-3", nome: "Raio-X Tórax", data: "15/11/2026", status: "Disponível" },
      ],
    }),
    []
  );

  // QR payload: pode ser URL interna, token, ou string de validação do cartão
  const qrPayload = useMemo(() => {
    // Exemplo: link para validar o cartão (você troca quando tiver endpoint)
    return `RADIOCLIMCARD:${data.card.numeroRaw}:${data.card.titular}:${data.card.validade}`;
  }, [data.card.numeroRaw, data.card.titular, data.card.validade]);

  const handleDownloadQr = () => {
    const canvas = document.getElementById("card-qrcode") as HTMLCanvasElement | null;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "radioclimcard-qrcode.png";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{data.user.nome}</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo(a) à sua área do Radioclim Card • <span className="font-medium text-foreground">{data.user.plano}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowQr((v) => !v)}>
            <QrCode className="mr-2 h-4 w-4" />
            {showQr ? "Ocultar QR Code" : "Ver QR Code"}
          </Button>

          <Button>
            <CalendarDays className="mr-2 h-4 w-4" />
            Agendar Consulta
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Consultas realizadas"
          value={data.kpis.consultasRealizadas}
          icon={<Stethoscope className="h-5 w-5" />}
        />
        <KpiCard title="Exames disponíveis" value={data.kpis.examesDisponiveis} icon={<ClipboardList className="h-5 w-5" />} />
        <KpiCard title="Economia total" value={formatBRL(data.kpis.economiaTotal)} icon={<Heart className="h-5 w-5" />} />
        <KpiCard title="Dependentes" value={data.kpis.dependentes} icon={<Users className="h-5 w-5" />} />
      </div>

      {/* Carteirinha + Agendamentos */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Carteirinha */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Carteirinha Digital</CardTitle>
              <Badge variant="secondary" className="rounded-full">
                <ShieldCheck className="mr-1 h-4 w-4" />
                {data.card.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Card visual */}
            <div className="rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 p-5 text-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs/4 opacity-90">CARTÃO DE BENEFÍCIOS</p>
                  <p className="text-lg font-semibold">Radioclim Card</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-2">
                  <QrCode className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-10 space-y-2">
                <p className="text-base font-semibold tracking-wider">{data.card.numero}</p>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] opacity-90">TITULAR</p>
                    <p className="text-sm font-medium">{data.card.titular}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] opacity-90">VALIDADE</p>
                    <p className="text-sm font-medium">{data.card.validade}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {showQr && (
              <div className="rounded-3xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">QR Code do Cartão</p>
                    <p className="text-xs text-muted-foreground">
                      Use para validação/identificação (você define o fluxo).
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadQr}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-center">
                  <div className="rounded-2xl bg-white p-4">
                    <QRCodeCanvas id="card-qrcode" value={qrPayload} size={180} includeMargin />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximos agendamentos */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Próximos Agendamentos</CardTitle>
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {data.proximosAgendamentos.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-2xl border bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{a.especialidade}</p>
                    <p className="text-sm text-muted-foreground">{a.profissional}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">
                    {a.data} • {a.hora}
                  </p>
                  <div className="mt-1 flex justify-end">{statusBadge(a.status)}</div>
                </div>
              </div>
            ))}

            {!data.proximosAgendamentos.length && (
              <div className="rounded-2xl border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                Nenhum agendamento encontrado.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exames recentes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Resultados de Exames</CardTitle>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.examesRecentes.map((e) => (
            <div key={e.id} className="rounded-2xl border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{e.nome}</p>
                    <p className="text-sm text-muted-foreground">{e.data}</p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {e.status}
                </span>
              </div>

              <div className="mt-4">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
              </div>
            </div>
          ))}

          {!data.examesRecentes.length && (
            <div className="col-span-full rounded-2xl border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Nenhum exame disponível no momento.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}
