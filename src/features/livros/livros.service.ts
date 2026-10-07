import type { ProvedorCatalogo } from "../../catalogo/catalogo.port.ts";
import type { ReadingStatus } from "../../generated/prisma/enums.ts";
import type { Tradutor } from "../../traducao/traducao.port.ts";
import type { LivrosRepository } from "./livros.repository.ts";
import type { LivroNaEstante } from "./livros.types.ts";

type DatasLeitura = {
  startedAt?: Date;
  finishedAt?: Date;
};

export class LivrosService {
  private repository: LivrosRepository;
  private catalogo: ProvedorCatalogo;
  private tradutor: Tradutor;

  constructor(repository: LivrosRepository, catalogo: ProvedorCatalogo, tradutor: Tradutor) {
    this.repository = repository;
    this.catalogo = catalogo;
    this.tradutor = tradutor;
  }

  buscarNoCatalogo(termo: string, pagina = 1, idioma?: string) {
    return this.catalogo.buscarLivros(termo, pagina, idioma);
  }

  async obterDetalhes(externalId: string, idioma?: string) {
    const detalhes = await this.catalogo.buscarDetalhes(externalId, idioma);
    if (!detalhes || !idioma) return detalhes;

    const [descricao, assuntos] = await Promise.all([
      detalhes.descricao ? this.tradutor.traduzir([detalhes.descricao], idioma).then(([texto]) => texto) : null,
      this.tradutor.traduzir(detalhes.assuntos, idioma),
    ]);
    return { ...detalhes, descricao, assuntos };
  }

  async obterStatusNaEstante(userId: string, externalId: string): Promise<ReadingStatus | null> {
    const item = await this.repository.findUserBookByExternalId(userId, externalId);
    return item?.status ?? null;
  }

  async adicionarNaEstante(
    userId: string,
    externalId: string,
    status: ReadingStatus,
    datas: DatasLeitura = {},
    idioma?: string,
  ) {
    const livro = await this.obterOuSalvarLivro(externalId, idioma);
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

  private async obterOuSalvarLivro(externalId: string, idioma?: string) {
    const existente = await this.repository.findBookByExternalId(externalId);
    if (existente) return existente;

    const doCatalogo = await this.catalogo.buscarPorId(externalId, idioma);
    if (!doCatalogo) {
      throw new Error("Livro não encontrado no catálogo");
    }
    return this.repository.upsertBook(doCatalogo);
  }
}
