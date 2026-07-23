// src/components/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import React, { createContext, useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

// --- FONT SIZE CONTEXT (inalterado) ---
type FontSize = "sm" | "base" | "lg";

export const FontSizeContext = createContext<{
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}>({
  fontSize: "base",
  setFontSize: () => {},
});

// --- AUTH CONTEXT (agora real, via Supabase Auth) ---

// Mantido o nome "User" e os campos "name"/"email" para não quebrar os
// componentes que já leem user.name / user.email (header, post-card,
// comment-section). "id" foi adicionado — necessário para checagens de dono
// mais seguras (ex.: PostCard hoje compara por email; pode migrar para id
// quando quiser).
export type User = {
  id: string;
  name: string;
  email: string;
};

export type ResultadoAuth = { ok: boolean; erro?: string };

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  /** @deprecated Existia só no mock. Mantido vazio para não quebrar imports antigos. */
  registeredUsers: never[];
  login: (email: string, password: string) => Promise<ResultadoAuth>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<ResultadoAuth>;
}>({
  user: null,
  loading: true,
  registeredUsers: [],
  login: async () => ({ ok: false, erro: "Provider não inicializado." }),
  logout: () => {},
  register: async () => ({ ok: false, erro: "Provider não inicializado." }),
});

function traduzirErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (m.includes("user already registered")) return "Este e-mail já está cadastrado.";
  if (m.includes("password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas. Espere alguns minutos.";
  return "Não conseguimos concluir agora. Tente de novo.";
}

// --- MAIN PROVIDER COMPONENT ---
export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);

  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  const carregarPerfil = useCallback(
    async (userId: string, email: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();

      setUser({
        id: userId,
        name: (data?.full_name as string) ?? email.split("@")[0],
        email,
      });
    },
    [supabase]
  );

  useEffect(() => {
    let ativo = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!ativo) return;
      if (data.user) {
        carregarPerfil(data.user.id, data.user.email ?? "").finally(() => {
          if (ativo) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, session) => {
      if (!ativo) return;
      if (session?.user) {
        carregarPerfil(session.user.id, session.user.email ?? "");
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, carregarPerfil]);

  const login = useCallback(
    async (email: string, password: string): Promise<ResultadoAuth> => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { ok: false, erro: traduzirErro(error.message) };
      return { ok: true };
    },
    [supabase]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<ResultadoAuth> => {
      if (name.trim().length < 2) return { ok: false, erro: "Informe seu nome." };
      if (password.length < 6) return { ok: false, erro: "A senha precisa ter pelo menos 6 caracteres." };

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (error) return { ok: false, erro: traduzirErro(error.message) };
      return { ok: true };
    },
    [supabase]
  );

  const logout = useCallback(() => {
    supabase.auth.signOut().then(() => setUser(null));
  }, [supabase]);

  const authContextValue = useMemo(
    () => ({ user, loading, registeredUsers: [] as never[], login, logout, register }),
    [user, loading, login, logout, register]
  );

  const fontSizeContextValue = useMemo(() => ({ fontSize, setFontSize }), [fontSize]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthContext.Provider value={authContextValue}>
        <FontSizeContext.Provider value={fontSizeContextValue}>
          {children}
        </FontSizeContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
