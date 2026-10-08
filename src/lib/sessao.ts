import { useSession } from "@tanstack/react-start/server";

export type DadosSessao = {
  userId: string;
};

const NOME_COOKIE = "estante_sessao";
const TRINTA_DIAS_EM_SEGUNDOS = 60 * 60 * 24 * 30;
const TAMANHO_MINIMO_SEGREDO = 32;

function segredoDaSessao() {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo || segredo.length < TAMANHO_MINIMO_SEGREDO) {
    throw new Error(
      `Defina a variável de ambiente SESSION_SECRET com pelo menos ${TAMANHO_MINIMO_SEGREDO} caracteres (ex.: openssl rand -base64 48).`,
    );
  }
  return segredo;
}

export function usarSessao() {
  return useSession<DadosSessao>({
    name: NOME_COOKIE,
    password: segredoDaSessao(),
    maxAge: TRINTA_DIAS_EM_SEGUNDOS,
    cookie: {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      path: "/",
    },
  });
}

export async function obterUserIdDaSessao(): Promise<string | null> {
  const sessao = await usarSessao();
  return sessao.data.userId ?? null;
}
