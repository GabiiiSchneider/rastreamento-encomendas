import { createServerFn } from "@tanstack/react-start";
import { perfilService } from "./perfil.compose";
import { comUsuario, exigirUsuario } from "../../lib/autenticacao";
import type { EditarPerfilDto, ObterPerfilPublicoDto, SalvarAvatarDto } from "./perfil.dto";
import { livrosService } from "../livros/livros.compose";
import type { ResultadoAvatar, ResultadoEdicao } from "./perfil.types";

export const obterMeuPerfil = createServerFn({ method: "GET" })
  .middleware([comUsuario])
  .handler(async ({ context }) => {
    if (!context.userId) return null;
    return perfilService.obterPerfil(context.userId);
  });

export const editarPerfil = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: EditarPerfilDto) => data)
  .handler(async ({ data, context }): Promise<ResultadoEdicao> => {
    return perfilService.editarPerfil(context.userId, data);
  });

export const salvarAvatar = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: SalvarAvatarDto) => data)
  .handler(async ({ data, context }): Promise<ResultadoAvatar> => {
    return perfilService.salvarAvatar(context.userId, data.avatarUrl);
  });

export const obterPerfilPublico = createServerFn({ method: "GET" })
  .middleware([exigirUsuario])
  .validator((data: ObterPerfilPublicoDto) => data)
  .handler(async ({ data, context }) => {
    const perfil = await perfilService.obterPerfilPublico(context.userId, String(data.username));
    if (!perfil) return null;
    const livrosLidos = await livrosService.listarEstante(perfil.id, "READ");
    return { perfil, livrosLidos };
  });
