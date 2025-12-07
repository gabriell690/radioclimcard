import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Calendar, 
  FileText, 
  Users, 
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  Stethoscope,
  Heart,
  Activity,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: CreditCard, label: "Meu Card", href: "#card", active: true },
  { icon: Calendar, label: "Agendamentos", href: "#agendamentos" },
  { icon: FileText, label: "Exames", href: "#exames" },
  { icon: Users, label: "Dependentes", href: "#dependentes" },
  { icon: Bell, label: "Notificações", href: "#notificacoes" },
  { icon: Settings, label: "Configurações", href: "#config" },
];

const appointments = [
  { 
    id: 1, 
    specialty: "Cardiologista", 
    doctor: "Dr. Roberto Silva", 
    date: "15/12/2024", 
    time: "09:00",
    status: "confirmado"
  },
  { 
    id: 2, 
    specialty: "Ultrassonografia", 
    doctor: "Dra. Ana Paula", 
    date: "18/12/2024", 
    time: "14:30",
    status: "agendado"
  },
  { 
    id: 3, 
    specialty: "Clínico Geral", 
    doctor: "Dr. Carlos Mendes", 
    date: "20/12/2024", 
    time: "10:00",
    status: "agendado"
  },
];

const exams = [
  { id: 1, name: "Hemograma Completo", date: "01/12/2024", status: "disponível" },
  { id: 2, name: "Ultrassonografia Abdominal", date: "28/11/2024", status: "disponível" },
  { id: 3, name: "Raio-X Tórax", date: "15/11/2024", status: "disponível" },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = {
    name: "Maria Silva Santos",
    plan: "Família",
    cardNumber: "7890 1234 5678 9012",
    validUntil: "12/2025",
    dependents: 3,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-success/10 text-success";
      case "agendado": return "bg-info/10 text-info";
      case "cancelado": return "bg-destructive/10 text-destructive";
      case "disponível": return "bg-primary/10 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmado": return CheckCircle2;
      case "agendado": return Clock;
      case "cancelado": return XCircle;
      default: return Clock;
    }
  };

  return (
    <>
      <Helmet>
        <title>Minha Área - Radioclim Card</title>
        <meta name="description" content="Acesse sua carteirinha digital, agende consultas, veja seus exames e gerencie seu plano Radioclim Card." />
      </Helmet>

      <div className="min-h-screen bg-muted/30 flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-lg font-bold text-foreground">Radioclim</span>
                  <span className="text-xs text-primary font-medium block -mt-1">Card</span>
                </div>
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    item.active 
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </a>
              ))}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Plano {user.plan}</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" asChild>
                <Link to="/">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  className="lg:hidden p-2 rounded-lg hover:bg-muted"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Olá, Maria!</h1>
                  <p className="text-sm text-muted-foreground">Bem-vinda à sua área do Radioclim Card</p>
                </div>
              </div>
              <Button variant="hero" asChild>
                <a href="#agendar">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </a>
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Stethoscope, label: "Consultas realizadas", value: "12", color: "text-primary" },
                { icon: Activity, label: "Exames disponíveis", value: "3", color: "text-accent" },
                { icon: Heart, label: "Economia total", value: "R$ 847", color: "text-success" },
                { icon: Users, label: "Dependentes", value: user.dependents.toString(), color: "text-info" },
              ].map((stat, index) => (
                <div key={index} className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl bg-muted flex items-center justify-center", stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Digital Card */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Carteirinha Digital
                  </h2>
                  
                  <div className="gradient-bg rounded-2xl p-6 aspect-[1.6/1] flex flex-col justify-between relative overflow-hidden card-shine">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-primary-foreground/70 font-medium">CARTÃO DE BENEFÍCIOS</div>
                        <div className="text-lg font-bold text-primary-foreground mt-1">Radioclim Card</div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                        <QrCode className="w-7 h-7 text-primary-foreground" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-base font-semibold text-primary-foreground tracking-wider mb-2">
                        {user.cardNumber}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-primary-foreground/70">TITULAR</div>
                          <div className="text-sm font-medium text-primary-foreground uppercase">{user.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-primary-foreground/70">VALIDADE</div>
                          <div className="text-sm font-medium text-primary-foreground">{user.validUntil}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <QrCode className="w-4 h-4 mr-2" />
                      Ver QR Code
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Appointments */}
              <div className="lg:col-span-2">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Próximos Agendamentos
                    </h2>
                    <Button variant="ghost" size="sm">
                      Ver todos
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {appointments.map((apt) => {
                      const StatusIcon = getStatusIcon(apt.status);
                      return (
                        <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{apt.specialty}</p>
                            <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">{apt.date}</p>
                            <p className="text-sm text-muted-foreground">{apt.time}</p>
                          </div>
                          <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(apt.status))}>
                            <StatusIcon className="w-3 h-3" />
                            {apt.status}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Exams */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Resultados de Exames
                </h2>
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exams.map((exam) => (
                  <div key={exam.id} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(exam.status))}>
                        {exam.status}
                      </span>
                    </div>
                    <p className="font-medium text-foreground mb-1">{exam.name}</p>
                    <p className="text-sm text-muted-foreground mb-3">{exam.date}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar PDF
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
