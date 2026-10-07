import { createServerFn } from "@tanstack/react-start";
import { perfilService } from "./perfil.compose";
import { obterUsuarioAtualId } from "../user/usuario-atual";

export const obterMeuPerfil = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await obterUsuarioAtualId();
  if (!userId) return null;
  return perfilService.obterPerfil(userId);
});
