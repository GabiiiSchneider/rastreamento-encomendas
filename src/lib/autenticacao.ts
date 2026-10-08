import { createMiddleware } from "@tanstack/react-start";
import { obterUserIdDaSessao } from "./sessao";

export const comUsuario = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const userId = await obterUserIdDaSessao();
  return next({ context: { userId } });
});

export const exigirUsuario = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const userId = await obterUserIdDaSessao();
  if (!userId) {
    throw new Error("Faça login para continuar.");
  }
  return next({ context: { userId } });
});
