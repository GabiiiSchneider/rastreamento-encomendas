import { createServerFn } from "@tanstack/react-start";
import { livrosService } from "./livros.compose";
import { obterUsuarioAtualId } from "../user/usuario-atual";
import type { AdicionarNaEstanteDto, BuscarLivrosDto, ListarEstanteDto } from "./livros.dto";

export const buscarLivros = createServerFn({ method: "GET" })
  .validator((data: BuscarLivrosDto) => data)
  .handler(async ({ data }) => {
    return livrosService.buscarNoCatalogo(data.termo);
  });

export const adicionarNaEstante = createServerFn({ method: "POST" })
  .validator((data: AdicionarNaEstanteDto) => data)
  .handler(async ({ data }) => {
    const userId = await obterUsuarioAtualId();
    if (!userId) {
      throw new Error("Usuário não encontrado");
    }
    await livrosService.adicionarNaEstante(userId, data.externalId, data.status);
  });

export const listarMinhaEstante = createServerFn({ method: "GET" })
  .validator((data: ListarEstanteDto) => data)
  .handler(async ({ data }) => {
    const userId = await obterUsuarioAtualId();
    if (!userId) return [];
    return livrosService.listarEstante(userId, data.status);
  });
