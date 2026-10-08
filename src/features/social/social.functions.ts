import { createServerFn } from "@tanstack/react-start";
import { socialService } from "./social.compose";
import { exigirUsuario } from "../../lib/autenticacao";
import type { BuscarLeitoresDto, ListarConexoesDto, SeguirDto, SugestoesDto } from "./social.dto";

export const seguirLeitor = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: SeguirDto) => data)
  .handler(async ({ data, context }) => {
    return socialService.seguir(context.userId, String(data.usuarioId));
  });

export const deixarDeSeguirLeitor = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: SeguirDto) => data)
  .handler(async ({ data, context }) => {
    return socialService.deixarDeSeguir(context.userId, String(data.usuarioId));
  });

export const sugestoesParaSeguir = createServerFn({ method: "GET" })
  .middleware([exigirUsuario])
  .validator((data: SugestoesDto) => data)
  .handler(async ({ data, context }) => {
    return socialService.sugestoes(context.userId, data.limite);
  });

export const buscarLeitores = createServerFn({ method: "GET" })
  .middleware([exigirUsuario])
  .validator((data: BuscarLeitoresDto) => data)
  .handler(async ({ data, context }) => {
    return socialService.buscar(context.userId, String(data.termo), data.pagina, data.limite);
  });

export const listarConexoes = createServerFn({ method: "GET" })
  .middleware([exigirUsuario])
  .validator((data: ListarConexoesDto) => data)
  .handler(async ({ data, context }) => {
    const tipo = data.tipo === "seguindo" ? "seguindo" : "seguidores";
    return socialService.listarConexoes(context.userId, String(data.username), tipo);
  });
