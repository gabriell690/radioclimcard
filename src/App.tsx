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
import MeuCard from "@/pages/app/MeuCard";
import AppHome from "@/pages/app/AppHome";
import FinanceiroAdmin from "@/pages/app/FinanceiroAdmin";
import AdminClinicas from "@/pages/app/admin/AdminClinicas";
import PedidosAdmin from "@/pages/app/PedidosAdmin";
import Agendamentos from "@/pages/app/Agendamentos";
import Exames from "@/pages/app/Exames";
import Dependentes from "@/pages/app/Dependentes";
import Notificacoes from "@/pages/app/Notificacoes";
import Servicos from "@/pages/app/Servicos"; // NOVO
import Perfil from "@/pages/app/Perfil";     // NOVO
import Configuracoes from "@/pages/app/Configuracoes";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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

        {/* 💳 Checkout (público por enquanto) */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/pendente" element={<CheckoutPendente />} />

        {/* 💼 Planos (se quiser pode deixar público, mas mantive protegido como estava) */}
        <Route
          path="/planos"
          element={
            <ProtectedRoute>
              <Planos />
            </ProtectedRoute>
          }
        />

        {/* 🔒 Área do Cliente (rotas aninhadas) */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
  path="/app/admin/clinicas"
  element={<AdminClinicas />}
/>

          <Route index element={<AppHome />} />
          <Route path="pedidos" element={<PedidosAdmin />} />
          <Route path="financeiro" element={<FinanceiroAdmin />} />
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="exames" element={<Exames />} />
          <Route path="dependentes" element={<Dependentes />} />
          <Route path="notificacoes" element={<Notificacoes />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        {/* 🔁 Compat: se alguém cair na rota antiga (opcional) */}
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
        

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
