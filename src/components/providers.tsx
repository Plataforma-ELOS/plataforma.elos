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
};

export const AuthContext = createContext<{
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

// --- MAIN PROVIDER COMPONENT ---
export function Providers({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  const fontSizeContextValue = useMemo(() => ({
    fontSize,
    setFontSize,
  }), [fontSize]);

  const authContextValue = useMemo(() => ({
    user,
    login: (loggedInUser: User) => setUser(loggedInUser),
    logout: () => setUser(null),
  }), [user]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthContext.Provider value={authContextValue}>
        <FontSizeContext.Provider value={fontSizeContextValue}>
          {children}
        </FontSizeContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
