import type { PerfilRepository } from "./perfil.repository";
import type { PerfilUsuario } from "./perfil.types";

export class PerfilService {
  private repository: PerfilRepository;

  constructor(repository: PerfilRepository) {
    this.repository = repository;
  }

  async obterPerfil(userId: string, hoje = new Date()): Promise<PerfilUsuario | null> {
    const usuario = await this.repository.findUserWithProfile(userId);
    if (!usuario) return null;

    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const esteMes = { inicio: new Date(ano, mes, 1), fim: new Date(ano, mes + 1, 1) };
    const esteAno = { inicio: new Date(ano, 0, 1), fim: new Date(ano + 1, 0, 1) };

    const [lidosNoMes, totalLidos, queroLer, lendo, lidosNoAno, meta] = await Promise.all([
      this.repository.countUserBooks(userId, "READ", esteMes),
      this.repository.countUserBooks(userId, "READ"),
      this.repository.countUserBooks(userId, "WANT_TO_READ"),
      this.repository.countUserBooks(userId, "READING"),
      this.repository.countUserBooks(userId, "READ", esteAno),
      this.repository.findGoal(userId, ano),
    ]);

    return {
      nome: usuario.name,
      usuario: usuario.profile?.username ?? null,
      bio: usuario.profile?.bio ?? null,
      generoFavorito: usuario.profile?.favorite_genre ?? null,
      estatisticas: { lidosNoMes, totalLidos, queroLer, lendo },
      meta: meta ? { ano, objetivo: meta.target, lidos: lidosNoAno } : null,
    };
  }
}
