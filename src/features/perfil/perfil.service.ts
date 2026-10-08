import type { PerfilRepository } from "./perfil.repository";
import type { PerfilPublico, PerfilUsuario, ResultadoAvatar, ResultadoEdicao } from "./perfil.types";
import { FORMATO_AVATAR, TAMANHO_MAXIMO_AVATAR, normalizarPerfil, validarPerfil, type DadosPerfil } from "./perfil.validacao";
import { periodoDoMes } from "../livros/livros.estante";

const MENSAGEM_USERNAME_EM_USO = "Esse nome de usuário já está em uso. Escolha outro.";

// erro do Prisma para violação de campo único (ex.: dois perfis salvando o mesmo username ao mesmo tempo)
function violouCampoUnico(erro: unknown) {
  return typeof erro === "object" && erro !== null && "code" in erro && erro.code === "P2002";
}

export class PerfilService {
  private repository: PerfilRepository;

  constructor(repository: PerfilRepository) {
    this.repository = repository;
  }

  async obterPerfil(userId: string, hoje = new Date()): Promise<PerfilUsuario | null> {
    const usuario = await this.repository.findUserWithProfile(userId);
    if (!usuario) return null;

    const ano = hoje.getFullYear();
    const esteMes = periodoDoMes(hoje);
    const esteAno = { inicio: new Date(ano, 0, 1), fim: new Date(ano + 1, 0, 1) };

    const [lidosNoMes, totalLidos, queroLer, lendo, lidosNoAno, meta, seguidores, seguindo, resenhas] = await Promise.all([
      this.repository.countUserBooks(userId, "READ", esteMes),
      this.repository.countUserBooks(userId, "READ"),
      this.repository.countUserBooks(userId, "WANT_TO_READ"),
      this.repository.countUserBooks(userId, "READING"),
      this.repository.countUserBooks(userId, "READ", esteAno),
      this.repository.findGoal(userId, ano),
      this.repository.countFollowers(userId),
      this.repository.countFollowing(userId),
      this.repository.countReviews(userId),
    ]);

    return {
      nome: usuario.name,
      usuario: usuario.profile?.username ?? null,
      bio: usuario.profile?.bio ?? null,
      generoFavorito: usuario.profile?.favorite_genre ?? null,
      avatarUrl: usuario.profile?.avatar_url ?? null,
      estatisticas: { lidosNoMes, totalLidos, queroLer, lendo },
      social: { seguidores, seguindo, resenhas },
      meta: meta ? { ano, objetivo: meta.target, lidos: lidosNoAno } : null,
    };
  }

  async obterPerfilPublico(viewerId: string, username: string): Promise<PerfilPublico | null> {
    const dono = await this.repository.findProfileByUsername(username.trim().toLowerCase());
    if (!dono) return null;

    const [perfil, euSigo] = await Promise.all([
      this.obterPerfil(dono.user_id),
      this.repository.isFollowing(viewerId, dono.user_id),
    ]);
    if (!perfil?.usuario) return null;
    return { ...perfil, id: dono.user_id, usuario: perfil.usuario, euSigo };
  }

  async editarPerfil(userId: string, dados: DadosPerfil): Promise<ResultadoEdicao> {
    // o validator da server function não roda o class-validator, então garante que tudo é texto
    const entrada: DadosPerfil = {
      nome: String(dados.nome ?? ""),
      username: String(dados.username ?? ""),
      bio: String(dados.bio ?? ""),
      generoFavorito: String(dados.generoFavorito ?? ""),
    };
    const erros = validarPerfil(entrada);
    if (Object.keys(erros).length > 0) return { ok: false, erros };

    const { nome, username, bio, generoFavorito } = normalizarPerfil(entrada);
    const dono = await this.repository.findProfileByUsername(username);
    if (dono && dono.user_id !== userId) return { ok: false, erros: { username: MENSAGEM_USERNAME_EM_USO } };

    try {
      await this.repository.updateUserAndProfile(userId, {
        nome,
        username,
        bio: bio || null,
        generoFavorito: generoFavorito || null,
      });
    } catch (erro) {
      if (violouCampoUnico(erro)) return { ok: false, erros: { username: MENSAGEM_USERNAME_EM_USO } };
      throw erro;
    }
    return { ok: true };
  }

  async salvarAvatar(userId: string, avatarUrl: string): Promise<ResultadoAvatar> {
    if (typeof avatarUrl !== "string" || avatarUrl.length > TAMANHO_MAXIMO_AVATAR || !FORMATO_AVATAR.test(avatarUrl)) {
      return { ok: false, mensagem: "Essa imagem não é válida. Escolha outra foto." };
    }

    const perfil = await this.repository.findProfileByUserId(userId);
    if (!perfil) {
      return { ok: false, mensagem: "Escolha um nome de usuário em “Editar perfil” antes de adicionar uma foto." };
    }

    await this.repository.updateAvatar(userId, avatarUrl);
    return { ok: true };
  }
}
