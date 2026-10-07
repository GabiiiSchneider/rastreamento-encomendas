import { createServerFn } from "@tanstack/react-start";
import { perfilService } from "./perfil.compose";
import { obterUsuarioAtualId } from "../user/usuario-atual";
import type { EditarPerfilDto, SalvarAvatarDto } from "./perfil.dto";
import type { ResultadoAvatar, ResultadoEdicao } from "./perfil.types";

export const obterMeuPerfil = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await obterUsuarioAtualId();
  if (!userId) return null;
  return perfilService.obterPerfil(userId);
});

export const obterResumoUsuario = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await obterUsuarioAtualId();
  if (!userId) return null;
  return perfilService.obterResumo(userId);
});

export const editarPerfil = createServerFn({ method: "POST" })
  .validator((data: EditarPerfilDto) => data)
  .handler(async ({ data }): Promise<ResultadoEdicao> => {
    const userId = await obterUsuarioAtualId();
    if (!userId) {
      throw new Error("Usuário não encontrado");
    }
    return perfilService.editarPerfil(userId, data);
  });

export const salvarAvatar = createServerFn({ method: "POST" })
  .validator((data: SalvarAvatarDto) => data)
  .handler(async ({ data }): Promise<ResultadoAvatar> => {
    const userId = await obterUsuarioAtualId();
    if (!userId) {
      throw new Error("Usuário não encontrado");
    }
    return perfilService.salvarAvatar(userId, data.avatarUrl);
  });
