/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

type Role = "admin" | "client" | null;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: Role;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchRole(userId: string): Promise<Role> {
  const { data, error } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

 if (error) {
  console.error("Erro ao buscar role em profiles:", error.message);
  return null; // não força client
}

  const role = (data?.role as "admin" | "client" | undefined) ?? "client";
  return role;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function boot() {
      // 1) Carrega sessão inicial
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao obter sessão:", error.message);
      }

      const sess = data.session ?? null;
      const usr = sess?.user ?? null;

      if (!alive) return;

      setSession(sess);
      setUser(usr);

      // 2) Se tiver usuário, busca a ROLE no profiles
      if (usr) {
        const r = await fetchRole(usr.id);
        if (!alive) return;
        setRole(r);
      } else {
        setRole(null);
      }

      setLoading(false);
    }

    boot();

    // 3) Escuta mudanças de autenticação (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      const usr = newSession?.user ?? null;

      setSession(newSession);
      setUser(usr);

      if (usr) {
        const r = await fetchRole(usr.id);
        if (!alive) return;
        setRole(r);
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  // 🔐 LOGIN
async function signIn(email: string, password: string) {
  const { data } = await supabase.auth.getSession();

  // só dá signOut se realmente existir sessão ativa
  if (data.session) {
    await supabase.auth.signOut();
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
}

  // 📝 CADASTRO
  async function signUp(email: string, password: string, name: string) {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      console.error("Erro no cadastro:", error.message);
      throw error;
    }
  }

  // 🚪 LOGOUT
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro no logout:", error.message);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook seguro
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
