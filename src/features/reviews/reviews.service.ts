import type { Prisma } from "../../generated/prisma/client";
import type { LivrosService } from "../livros/livros.service";
import type { PosicaoCursor, ResenhaDoBanco, ReviewsRepository } from "./reviews.repository";
import type { Comentario, PaginaResenhas, Resenha, ResultadoAcao } from "./reviews.types";
import type { AbaFeed, FiltroSpoiler } from "./reviews.feed";
import { FORMATO_EXTERNAL_ID, validarComentario, validarConteudoResenha, validarNota } from "./reviews.validacao";

const RESENHAS_POR_PAGINA = 10;
const MAXIMO_COMENTARIOS = 100;

type DadosPublicacao = {
  externalId: string;
  conteudo: string;
  nota?: number | null;
  temSpoiler: boolean;
};

type AutorDoBanco = ResenhaDoBanco["user"];

function paraAutor(usuario: AutorDoBanco) {
  return {
    id: usuario.id,
    nome: usuario.name,
    username: usuario.profile?.username ?? null,
    avatarUrl: usuario.profile?.avatar_url ?? null,
  };
}

function paraResenha(item: ResenhaDoBanco, viewerId: string): Resenha {
  return {
    id: item.id,
    conteudo: item.content,
    nota: item.rating,
    temSpoiler: item.has_spoiler,
    criadaEm: item.created_at.toISOString(),
    autor: paraAutor(item.user),
    livro: {
      externalId: item.book.external_id,
      titulo: item.book.title,
      autor: item.book.author,
      capaUrl: item.book.cover_url,
    },
    curtidas: item._count.likes,
    comentarios: item._count.comments,
    curtidaPorMim: item.likes.length > 0,
    minha: item.user.id === viewerId,
  };
}

function cursorRecente(item: { created_at: Date; id: string }) {
  return `r:${item.created_at.toISOString()}|${item.id}`;
}

function lerCursorRecente(cursor?: string): PosicaoCursor | undefined {
  const [data, id] = cursor?.startsWith("r:") ? cursor.slice(2).split("|") : [];
  const criadaEm = data ? new Date(data) : null;
  return criadaEm && id && !Number.isNaN(criadaEm.getTime()) ? { criadaEm, id } : undefined;
}

function lerCursorPosicao(cursor?: string) {
  const posicao = cursor?.startsWith("p:") ? Number(cursor.slice(2)) : 0;
  return Number.isInteger(posicao) && posicao > 0 ? posicao : 0;
}

function violouCampoUnico(erro: unknown) {
  return typeof erro === "object" && erro !== null && "code" in erro && erro.code === "P2002";
}

export class ReviewsService {
  private repository: ReviewsRepository;
  private livros: LivrosService;

  constructor(repository: ReviewsRepository, livros: LivrosService) {
    this.repository = repository;
    this.livros = livros;
  }

  async listarFeed(viewerId: string, aba: AbaFeed, filtro: FiltroSpoiler = "todas", cursor?: string): Promise<PaginaResenhas> {
    if (aba === "resenhas") {
      const where: Prisma.ReviewWhereInput = filtro === "todas" ? {} : { has_spoiler: filtro === "com-spoiler" };
      return this.paginaMaisCurtidas(viewerId, where, cursor);
    }
    const where: Prisma.ReviewWhereInput =
      aba === "seguindo" ? { OR: [{ user_id: viewerId }, { user: { followers: { some: { follower_id: viewerId } } } }] } : {};
    return this.paginaRecentes(viewerId, where, cursor);
  }

  async listarDoLeitor(viewerId: string, username: string, cursor?: string): Promise<PaginaResenhas> {
    const perfil = await this.repository.findUserIdByUsername(username.trim().toLowerCase());
    if (!perfil) return { resenhas: [], proximoCursor: null };
    return this.paginaRecentes(viewerId, { user_id: perfil.user_id }, cursor);
  }

  buscar(viewerId: string, termo: string, cursor?: string, limite = RESENHAS_POR_PAGINA): Promise<PaginaResenhas> {
    const busca = termo.trim();
    if (!busca) return Promise.resolve({ resenhas: [], proximoCursor: null });
    const contem = { contains: busca, mode: "insensitive" as const };
    return this.paginaRecentes(
      viewerId,
      { OR: [{ content: contem }, { book: { title: contem } }, { book: { author: contem } }] },
      cursor,
      Math.min(30, Math.max(1, Math.floor(limite))),
    );
  }

  async publicar(userId: string, dados: DadosPublicacao, idioma?: string): Promise<ResultadoAcao<Resenha>> {
    const nota = dados.nota ?? null;
    const erro = validarConteudoResenha(dados.conteudo) ?? validarNota(nota);
    if (erro) return { ok: false, mensagem: erro };
    if (typeof dados.externalId !== "string" || !FORMATO_EXTERNAL_ID.test(dados.externalId)) {
      return { ok: false, mensagem: "Escolha um livro da lista." };
    }

    const livro = await this.livros.obterOuSalvarLivro(dados.externalId, idioma);
    const { id } = await this.repository.create({
      userId,
      bookId: livro.id,
      conteudo: dados.conteudo.trim(),
      nota,
      temSpoiler: dados.temSpoiler === true,
    });

    const criada = await this.repository.findById(userId, id);
    if (!criada) return { ok: false, mensagem: "Não foi possível publicar a resenha." };
    return { ok: true, valor: paraResenha(criada, userId) };
  }

  async excluir(userId: string, resenhaId: string): Promise<ResultadoAcao<null>> {
    const { count } = await this.repository.deleteOwn(userId, resenhaId);
    if (count === 0) return { ok: false, mensagem: "Essa resenha não existe ou não é sua." };
    return { ok: true, valor: null };
  }

  async alternarCurtida(userId: string, resenhaId: string): Promise<ResultadoAcao<{ curtida: boolean; curtidas: number }>> {
    if (!(await this.repository.exists(resenhaId))) return { ok: false, mensagem: "Essa resenha não existe mais." };

    const jaCurtiu = await this.repository.findLike(userId, resenhaId);
    if (jaCurtiu) {
      await this.repository.deleteLike(userId, resenhaId);
    } else {
      try {
        await this.repository.createLike(userId, resenhaId);
      } catch (erro) {
        if (!violouCampoUnico(erro)) throw erro;
      }
    }
    return { ok: true, valor: { curtida: !jaCurtiu, curtidas: await this.repository.countLikes(resenhaId) } };
  }

  async listarComentarios(viewerId: string, resenhaId: string): Promise<Comentario[]> {
    const comentarios = await this.repository.findComments(resenhaId, MAXIMO_COMENTARIOS);
    return comentarios.map((item) => ({
      id: item.id,
      conteudo: item.content,
      criadoEm: item.created_at.toISOString(),
      autor: paraAutor(item.user),
      meu: item.user.id === viewerId,
    }));
  }

  async comentar(userId: string, resenhaId: string, conteudo: string): Promise<ResultadoAcao<Comentario>> {
    const erro = validarComentario(conteudo);
    if (erro) return { ok: false, mensagem: erro };
    if (!(await this.repository.exists(resenhaId))) return { ok: false, mensagem: "Essa resenha não existe mais." };

    const item = await this.repository.createComment(userId, resenhaId, conteudo.trim());
    return {
      ok: true,
      valor: { id: item.id, conteudo: item.content, criadoEm: item.created_at.toISOString(), autor: paraAutor(item.user), meu: true },
    };
  }

  async excluirComentario(userId: string, comentarioId: string): Promise<ResultadoAcao<null>> {
    const { count } = await this.repository.deleteOwnComment(userId, comentarioId);
    if (count === 0) return { ok: false, mensagem: "Esse comentário não existe ou não é seu." };
    return { ok: true, valor: null };
  }

  private async paginaRecentes(viewerId: string, where: Prisma.ReviewWhereInput, cursor?: string, limite = RESENHAS_POR_PAGINA) {
    const itens = await this.repository.findRecent(viewerId, where, limite + 1, lerCursorRecente(cursor));
    const pagina = itens.slice(0, limite);
    const ultima = pagina.at(-1);
    return {
      resenhas: pagina.map((item) => paraResenha(item, viewerId)),
      proximoCursor: itens.length > limite && ultima ? cursorRecente(ultima) : null,
    };
  }

  private async paginaMaisCurtidas(viewerId: string, where: Prisma.ReviewWhereInput, cursor?: string) {
    const posicao = lerCursorPosicao(cursor);
    const itens = await this.repository.findMostLiked(viewerId, where, RESENHAS_POR_PAGINA + 1, posicao);
    return {
      resenhas: itens.slice(0, RESENHAS_POR_PAGINA).map((item) => paraResenha(item, viewerId)),
      proximoCursor: itens.length > RESENHAS_POR_PAGINA ? `p:${posicao + RESENHAS_POR_PAGINA}` : null,
    };
  }
}
