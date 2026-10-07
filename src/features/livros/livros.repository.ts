import type { PrismaClient } from "../../generated/prisma/client.ts";
import type { ReadingStatus } from "../../generated/prisma/enums.ts";
import type { LivroCatalogo } from "../../catalogo/catalogo.port.ts";

type DadosEstante = {
  userId: string;
  bookId: string;
  status: ReadingStatus;
  startedAt?: Date;
  finishedAt?: Date;
};

export class LivrosRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findBookByExternalId(externalId: string) {
    return this.prisma.book.findUnique({ where: { external_id: externalId } });
  }

  upsertBook(livro: LivroCatalogo) {
    return this.prisma.book.upsert({
      where: { external_id: livro.externalId },
      update: {},
      create: {
        external_id: livro.externalId,
        title: livro.titulo,
        author: livro.autor,
        genre: livro.genero,
        cover_url: livro.capaUrl,
        published_at: livro.ano,
      },
    });
  }

  upsertUserBook(dados: DadosEstante) {
    return this.prisma.userBook.upsert({
      where: { user_id_book_id: { user_id: dados.userId, book_id: dados.bookId } },
      update: {
        status: dados.status,
        started_at: dados.startedAt,
        finished_at: dados.finishedAt,
      },
      create: {
        user_id: dados.userId,
        book_id: dados.bookId,
        status: dados.status,
        started_at: dados.startedAt,
        finished_at: dados.finishedAt,
      },
    });
  }

  findUserBookByExternalId(userId: string, externalId: string) {
    return this.prisma.userBook.findFirst({
      where: { user_id: userId, book: { external_id: externalId } },
      select: { status: true },
    });
  }

  findUserBooksByStatus(userId: string, status: ReadingStatus) {
    return this.prisma.userBook.findMany({
      where: { user_id: userId, status },
      include: { book: true },
      orderBy: { updated_at: "desc" },
    });
  }
}
