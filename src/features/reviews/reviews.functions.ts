import { createServerFn } from "@tanstack/react-start";
import { reviewsService } from "./reviews.compose";
import { exigirUsuario } from "../../lib/autenticacao";
import { obterIdiomaDoNavegador } from "../../traducao/idioma";
import { abaFeedValida, filtroSpoilerValido } from "./reviews.feed";
import type {
  BuscarResenhasDto,
  ComentarDto,
  ComentarioIdDto,
  ListarFeedDto,
  PublicarResenhaDto,
  ResenhaIdDto,
  ResenhasDoLeitorDto,
} from "./reviews.dto";

export const listarFeed = createServerFn({ method: "GET" })
  .middleware([exigirUsuario])
  .validator((data: ListarFeedDto) => data)
  .handler(async ({ data, context }) => {
    const aba = abaFeedValida(data.aba) ? data.aba : "novidades";
    const filtro = filtroSpoilerValido(data.filtro) ? data.filtro : "todas";
    return reviewsService.listarFeed(context.userId, aba, filtro, data.cursor);
  });

export const listarResenhasDoLeitor = createServerFn({ method: "GET" })
  .middleware([exigirUsuario])
  .validator((data: ResenhasDoLeitorDto) => data)
  .handler(async ({ data, context }) => {
    return reviewsService.listarDoLeitor(context.userId, String(data.username), data.cursor);
  });

export const buscarResenhas = createServerFn({ method: "GET" })
  .middleware([exigirUsuario])
  .validator((data: BuscarResenhasDto) => data)
  .handler(async ({ data, context }) => {
    return reviewsService.buscar(context.userId, String(data.termo), data.cursor, data.limite);
  });

export const publicarResenha = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: PublicarResenhaDto) => data)
  .handler(async ({ data, context }) => {
    return reviewsService.publicar(context.userId, data, obterIdiomaDoNavegador());
  });

export const excluirResenha = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: ResenhaIdDto) => data)
  .handler(async ({ data, context }) => {
    return reviewsService.excluir(context.userId, String(data.resenhaId));
  });

export const alternarCurtida = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: ResenhaIdDto) => data)
  .handler(async ({ data, context }) => {
    return reviewsService.alternarCurtida(context.userId, String(data.resenhaId));
  });

export const listarComentarios = createServerFn({ method: "GET" })
  .middleware([exigirUsuario])
  .validator((data: ResenhaIdDto) => data)
  .handler(async ({ data, context }) => {
    return reviewsService.listarComentarios(context.userId, String(data.resenhaId));
  });

export const comentarResenha = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: ComentarDto) => data)
  .handler(async ({ data, context }) => {
    return reviewsService.comentar(context.userId, String(data.resenhaId), data.conteudo);
  });

export const excluirComentario = createServerFn({ method: "POST" })
  .middleware([exigirUsuario])
  .validator((data: ComentarioIdDto) => data)
  .handler(async ({ data, context }) => {
    return reviewsService.excluirComentario(context.userId, String(data.comentarioId));
  });
