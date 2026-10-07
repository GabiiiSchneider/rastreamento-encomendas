import { createServerFn } from "@tanstack/react-start";
import { livrosService } from "./livros.compose";
import { obterUsuarioAtualId } from "../user/usuario-atual";
import { obterIdiomaDoNavegador } from "../../traducao/idioma";
import { livroIdValido, paraExternalId } from "./livros.ids";
import { abaValida } from "./livros.estante";
import type {
  AdicionarNaEstanteDto,
  BuscarLivrosDto,
  ListarEstanteDto,
  ListarEstantePaginadaDto,
  ObterLivroDto,
  ObterStatusNaEstanteDto,
} from "./livros.dto";

export const buscarLivros = createServerFn({ method: "GET" })
  .validator((data: BuscarLivrosDto) => data)
  .handler(async ({ data }) => {
    return livrosService.buscarNoCatalogo(data.termo, data.pagina, obterIdiomaDoNavegador());
  });

export const obterLivro = createServerFn({ method: "GET" })
  .validator((data: ObterLivroDto) => data)
  .handler(async ({ data }) => {
    if (!livroIdValido(data.livroId)) return null;
    return livrosService.obterDetalhes(paraExternalId(data.livroId), obterIdiomaDoNavegador());
  });

export const adicionarNaEstante = createServerFn({ method: "POST" })
  .validator((data: AdicionarNaEstanteDto) => data)
  .handler(async ({ data }) => {
    const userId = await obterUsuarioAtualId();
    if (!userId) {
      throw new Error("Usuário não encontrado");
    }
    await livrosService.adicionarNaEstante(userId, data.externalId, data.status, {}, obterIdiomaDoNavegador());
  });

export const obterStatusNaEstante = createServerFn({ method: "GET" })
  .validator((data: ObterStatusNaEstanteDto) => data)
  .handler(async ({ data }) => {
    const userId = await obterUsuarioAtualId();
    if (!userId) return null;
    return livrosService.obterStatusNaEstante(userId, data.externalId);
  });

export const listarMinhaEstante = createServerFn({ method: "GET" })
  .validator((data: ListarEstanteDto) => data)
  .handler(async ({ data }) => {
    const userId = await obterUsuarioAtualId();
    if (!userId) return [];
    return livrosService.listarEstante(userId, data.status);
  });

export const listarEstantePaginada = createServerFn({ method: "GET" })
  .validator((data: ListarEstantePaginadaDto) => data)
  .handler(async ({ data }) => {
    const userId = await obterUsuarioAtualId();
    if (!userId || !abaValida(data.aba)) return { livros: [], total: 0, pagina: 1, porPagina: 12 };
    return livrosService.listarEstantePaginada(userId, data.aba, data.pagina);
  });
