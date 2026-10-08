import type { LeitorDoBanco, SocialRepository } from "./social.repository";
import type { Leitor, PaginaLeitores, ResultadoSeguir, TipoConexao } from "./social.types";

const LEITORES_POR_PAGINA = 12;
const MAXIMO_CONEXOES = 100;

function paraLeitor(item: LeitorDoBanco, viewerId: string): Leitor | null {
  if (!item.profile) return null;
  return {
    id: item.id,
    nome: item.name,
    username: item.profile.username,
    avatarUrl: item.profile.avatar_url,
    bio: item.profile.bio,
    resenhas: item._count.reviews,
    seguidores: item._count.followers,
    euSigo: item.followers.length > 0,
    ehVoce: item.id === viewerId,
  };
}

function violouCampoUnico(erro: unknown) {
  return typeof erro === "object" && erro !== null && "code" in erro && erro.code === "P2002";
}

export class SocialService {
  private repository: SocialRepository;

  constructor(repository: SocialRepository) {
    this.repository = repository;
  }

  async seguir(viewerId: string, alvoId: string): Promise<ResultadoSeguir> {
    if (alvoId === viewerId) return { ok: false, mensagem: "Você não pode seguir a si mesmo." };
    if (!(await this.repository.userExists(alvoId))) return { ok: false, mensagem: "Esse leitor não existe mais." };

    try {
      await this.repository.createFollow(viewerId, alvoId);
    } catch (erro) {
      if (!violouCampoUnico(erro)) throw erro;
    }
    return { ok: true, seguindo: true, seguidores: await this.repository.countFollowers(alvoId) };
  }

  async deixarDeSeguir(viewerId: string, alvoId: string): Promise<ResultadoSeguir> {
    await this.repository.deleteFollow(viewerId, alvoId);
    return { ok: true, seguindo: false, seguidores: await this.repository.countFollowers(alvoId) };
  }

  async sugestoes(viewerId: string, limite = 5): Promise<Leitor[]> {
    const itens = await this.repository.findSuggestions(viewerId, Math.min(20, Math.max(1, Math.floor(limite))));
    return itens.map((item) => paraLeitor(item, viewerId)).filter((leitor) => leitor !== null);
  }

  async buscar(viewerId: string, termo: string, pagina = 1, limite = LEITORES_POR_PAGINA): Promise<PaginaLeitores> {
    const busca = termo.trim().replace(/^@/, "");
    const paginaValida = Math.max(1, Math.floor(pagina));
    const porPagina = Math.min(30, Math.max(1, Math.floor(limite)));
    if (!busca) return { leitores: [], total: 0, pagina: paginaValida, porPagina };

    const { leitores, total } = await this.repository.searchReaders(viewerId, busca, (paginaValida - 1) * porPagina, porPagina);
    return {
      leitores: leitores.map((item) => paraLeitor(item, viewerId)).filter((leitor) => leitor !== null),
      total,
      pagina: paginaValida,
      porPagina,
    };
  }

  async listarConexoes(viewerId: string, username: string, tipo: TipoConexao): Promise<Leitor[]> {
    const perfil = await this.repository.findUserIdByUsername(username.trim().toLowerCase());
    if (!perfil) return [];
    const itens = await this.repository.findConnections(viewerId, perfil.user_id, tipo, MAXIMO_CONEXOES);
    return itens.map((item) => paraLeitor(item, viewerId)).filter((leitor) => leitor !== null);
  }
}
