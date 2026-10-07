import type { ProvedorCatalogo } from "../../catalogo/catalogo.port.ts";
import type { ReadingStatus } from "../../generated/prisma/enums.ts";
import type { LivrosRepository } from "./livros.repository.ts";
import type { LivroNaEstante } from "./livros.types.ts";

type DatasLeitura = {
  startedAt?: Date;
  finishedAt?: Date;
};

export class LivrosService {
  private repository: LivrosRepository;
  private catalogo: ProvedorCatalogo;

  constructor(repository: LivrosRepository, catalogo: ProvedorCatalogo) {
    this.repository = repository;
    this.catalogo = catalogo;
  }

  buscarNoCatalogo(termo: string) {
    return this.catalogo.buscarLivros(termo);
  }

  async adicionarNaEstante(userId: string, externalId: string, status: ReadingStatus, datas: DatasLeitura = {}) {
    const livro = await this.obterOuSalvarLivro(externalId);
    const agora = new Date();

    return this.repository.upsertUserBook({
      userId,
      bookId: livro.id,
      status,
      startedAt: datas.startedAt ?? (status === "READING" ? agora : undefined),
      finishedAt: datas.finishedAt ?? (status === "READ" ? agora : undefined),
    });
  }

  async listarEstante(userId: string, status: ReadingStatus): Promise<LivroNaEstante[]> {
    const itens = await this.repository.findUserBooksByStatus(userId, status);
    return itens.map(({ id, book }) => ({
      id,
      externalId: book.external_id,
      titulo: book.title,
      autor: book.author,
      genero: book.genre,
      capaUrl: book.cover_url,
    }));
  }

  private async obterOuSalvarLivro(externalId: string) {
    const existente = await this.repository.findBookByExternalId(externalId);
    if (existente) return existente;

    const doCatalogo = await this.catalogo.buscarPorId(externalId);
    if (!doCatalogo) {
      throw new Error("Livro não encontrado no catálogo");
    }
    return this.repository.upsertBook(doCatalogo);
  }
}
