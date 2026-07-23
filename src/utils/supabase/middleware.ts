// src/utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Rotas que exigem login. Ajuste esta lista conforme novas telas logadas surgirem.
// cadastro-profissional exige login porque a insercao em professionals/
// clinics so e permitida para o role authenticated (RLS) — por isso tambem
// NAO entra em ROTAS_DE_AUTH abaixo (ao contrario de /login e /cadastro,
// aqui um usuario ja logado e o caso de uso esperado, nao um erro).
const ROTAS_PRIVADAS = [
  "/comunidade/criar-grupo",
  "/comunidade/meus-grupos",
  "/cadastro-profissional",
];

// Rotas de autenticação que um usuário já logado não deveria ver de novo.
const ROTAS_DE_AUTH = ["/login", "/cadastro"];

export const createClient = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  // IMPORTANT: Do not run code between createServerClient and getUser().
  // Refreshing the auth token keeps the user's session alive across requests.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && ROTAS_PRIVADAS.some((rota) => path.startsWith(rota))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (user && ROTAS_DE_AUTH.some((rota) => path === rota)) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};
