// src/components/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import React, { createContext, useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

// --- FONT SIZE CONTEXT ---
type FontSize = "sm" | "base" | "lg";

export const FontSizeContext = createContext<{
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}>({
  fontSize: "base",
  setFontSize: () => {},
});

// --- AUTH CONTEXT ---
type User = {
  name: string;
  email: string;
  password?: string; // a senha é opcional aqui, usada apenas para o mock
};

// Mock de usuários cadastrados
const initialRegisteredUsers: User[] = [
  { email: 'maria.silva@example.com', password: '123', name: 'Maria Silva' },
  { email: 'joao.costa@example.com', password: '123', name: 'João Costa' },
  { email: 'admin@elos.com.br', password: 'admin', name: 'Admin Elos' },
];


export const AuthContext = createContext<{
  user: User | null;
  registeredUsers: User[];
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
}>({
  user: null,
  registeredUsers: [],
  login: () => {},
  logout: () => {},
  register: () => {},
});

// --- MAIN PROVIDER COMPONENT ---
export function Providers({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(initialRegisteredUsers);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  const fontSizeContextValue = useMemo(() => ({
    fontSize,
    setFontSize,
  }), [fontSize]);
  
  const handleRegister = (newUser: User) => {
    // Adiciona o novo usuário à lista de usuários registrados
    setRegisteredUsers(prevUsers => [...prevUsers, newUser]);
  };

  const authContextValue = useMemo(() => ({
    user,
    registeredUsers,
    login: (loggedInUser: User) => setUser(loggedInUser),
    logout: () => setUser(null),
    register: handleRegister,
  }), [user, registeredUsers]);

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
