// src/components/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import React, { createContext, useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

type FontSize = "sm" | "base" | "lg";

export const FontSizeContext = createContext<{
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}>({
  fontSize: "base",
  setFontSize: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("base");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  const fontSizeContextValue = useMemo(() => ({
    fontSize,
    setFontSize,
  }), [fontSize]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FontSizeContext.Provider value={fontSizeContextValue}>
        {children}
      </FontSizeContext.Provider>
    </ThemeProvider>
  );
}
