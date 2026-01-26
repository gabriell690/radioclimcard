import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, loading, role } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    // Se não for admin, manda para área normal
    return <Navigate to="/app" replace />;
  }

  return children;
}
