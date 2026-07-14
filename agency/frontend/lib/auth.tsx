"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin } from "./api";

interface AuthContextValue {
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "agency_admin_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setToken(stored);
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const newToken = await apiLogin(email, password);
    window.localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    router.push("/admin/login");
  }

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
