import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@/lib/auth";
import { HelmetProvider } from "react-helmet-async";
import "./index.css"; // ✅ ISSO AQUI É O QUE TRÁS O DESIGN DE VOLTA

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
