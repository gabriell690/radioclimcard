import { useAuth } from "@/lib/auth";

export type Role = "client" | "admin" | "conveniada" | null;

export function useRole() {
  const { role, loading } = useAuth();
  return { role, loadingRole: loading };
}