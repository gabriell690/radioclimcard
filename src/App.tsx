import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Planos from "@/pages/Planos";
import Contato from "@/pages/Contato";
import Sobre from "@/pages/Sobre";
import Conveniados from "@/pages/Conveniados";
import Checkout from "@/pages/Checkout";
import CheckoutPendente from "@/pages/CheckoutPendente";
import NotFound from "@/pages/NotFound";

import AppLayout from "@/pages/AppLayout";

// CLIENTE
import AppHome from "@/pages/app/AppHome";
import MeuCard from "@/pages/app/MeuCard";
import Agendamentos from "@/pages/app/Agendamentos";
import Exames from "@/pages/app/Exames";
import Dependentes from "@/pages/app/Dependentes";
import Notificacoes from "@/pages/app/Notificacoes";
import Servicos from "@/pages/app/Servicos";
import Perfil from "@/pages/app/Perfil";
import Configuracoes from "@/pages/app/Configuracoes";

// ADMIN (componentes que você já tem)
// ADMIN
import AdminDashboard from "@/pages/app/admin/AdminDashboard";
import AdminClinicas from "@/pages/app/admin/AdminClinicas";
import PedidosAdmin from "@/pages/app/admin/PedidosAdmin";
import FinanceiroAdmin from "@/pages/app/admin/FinanceiroAdmin";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { useAuth } from "@/lib/auth";

/**
 * Redireciona automaticamente /app para:
 * - /app/admin (se role=admin)
 * - /app/home (cliente)
 */
function AppIndexRedirect() {
  const { role, loading } = useAuth();

  if (loading) return null;

  if (role === "admin") {
    return <Navigate to="/app/admin" replace />;
  }

  return <Navigate to="/app/home" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Landing pública */}
        <Route path="/" element={<Index />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />

        {/* 📄 Páginas públicas */}
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/conveniados" element={<Conveniados />} />

        {/* 💳 Checkout */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/pendente" element={<CheckoutPendente />} />

        {/* 💼 Planos (exige login) */}
        <Route
          path="/planos"
          element={
            <ProtectedRoute>
              <Planos />
            </ProtectedRoute>
          }
        />

        {/* 🔒 Área logada (cliente + admin) */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* ✅ INDEX: manda admin para /app/admin e cliente para /app/home */}
          <Route index element={<AppIndexRedirect />} />

          {/* ===================== CLIENTE ===================== */}
          <Route path="home" element={<AppHome />} />
          <Route path="meu-card" element={<MeuCard />} />
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="exames" element={<Exames />} />
          <Route path="dependentes" element={<Dependentes />} />
          <Route path="notificacoes" element={<Notificacoes />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="configuracoes" element={<Configuracoes />} />

          {/* ===================== ADMIN ===================== */}
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="admin/pedidos"
            element={
              <AdminRoute>
                <PedidosAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="admin/financeiro"
            element={
              <AdminRoute>
                <FinanceiroAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="admin/clinicas"
            element={
              <AdminRoute>
                <AdminClinicas />
              </AdminRoute>
            }
          />

          {/* fallback interno do /app */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>

        {/* 🔁 Compat: rota antiga */}
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;