import type { Prisma, PrismaClient } from "../../generated/prisma/client";

const autorSelecionado = {
  select: { id: true, name: true, profile: { select: { username: true, avatar_url: true } } },
} as const;

function selecaoResenha(viewerId: string) {
  return {
    id: true,
    content: true,
    rating: true,
    has_spoiler: true,
    created_at: true,
    user: autorSelecionado,
    book: { select: { external_id: true, title: true, author: true, cover_url: true } },
    likes: { where: { user_id: viewerId }, select: { user_id: true } },
    _count: { select: { likes: true, comments: true } },
  } satisfies Prisma.ReviewSelect;
}

export type ResenhaDoBanco = Prisma.ReviewGetPayload<{ select: ReturnType<typeof selecaoResenha> }>;

export type PosicaoCursor = { criadaEm: Date; id: string };

type DadosResenha = {
  userId: string;
  bookId: string;
  conteudo: string;
  nota: number | null;
  temSpoiler: boolean;
};

export class ReviewsRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findRecent(viewerId: string, where: Prisma.ReviewWhereInput, take: number, depoisDe?: PosicaoCursor) {
    const cursor: Prisma.ReviewWhereInput | undefined = depoisDe && {
      OR: [{ created_at: { lt: depoisDe.criadaEm } }, { created_at: depoisDe.criadaEm, id: { lt: depoisDe.id } }],
    };
    return this.prisma.review.findMany({
      where: cursor ? { AND: [where, cursor] } : where,
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      take,
      select: selecaoResenha(viewerId),
    });
  }

  findMostLiked(viewerId: string, where: Prisma.ReviewWhereInput, take: number, skip: number) {
    return this.prisma.review.findMany({
      where,
      orderBy: [{ likes: { _count: "desc" } }, { created_at: "desc" }, { id: "desc" }],
      take,
      skip,
      select: selecaoResenha(viewerId),
    });
  }

  findById(viewerId: string, id: string) {
    return this.prisma.review.findUnique({ where: { id }, select: selecaoResenha(viewerId) });
  }

  create(dados: DadosResenha) {
    return this.prisma.review.create({
      data: {
        user_id: dados.userId,
        book_id: dados.bookId,
        content: dados.conteudo,
        rating: dados.nota,
        has_spoiler: dados.temSpoiler,
      },
      select: { id: true },
    });
  }

  deleteOwn(userId: string, id: string) {
    return this.prisma.review.deleteMany({ where: { id, user_id: userId } });
  }

  exists(id: string) {
    return this.prisma.review.count({ where: { id } }).then((total) => total > 0);
  }

  findLike(userId: string, reviewId: string) {
    return this.prisma.reviewLike.findUnique({ where: { user_id_review_id: { user_id: userId, review_id: reviewId } } });
  }

  createLike(userId: string, reviewId: string) {
    return this.prisma.reviewLike.create({ data: { user_id: userId, review_id: reviewId } });
  }

  deleteLike(userId: string, reviewId: string) {
    return this.prisma.reviewLike.deleteMany({ where: { user_id: userId, review_id: reviewId } });
  }

  countLikes(reviewId: string) {
    return this.prisma.reviewLike.count({ where: { review_id: reviewId } });
  }

  findComments(reviewId: string, take: number) {
    return this.prisma.reviewComment.findMany({
      where: { review_id: reviewId },
      orderBy: [{ created_at: "asc" }, { id: "asc" }],
      take,
      select: { id: true, content: true, created_at: true, user: autorSelecionado },
    });
  }

  createComment(userId: string, reviewId: string, conteudo: string) {
    return this.prisma.reviewComment.create({
      data: { user_id: userId, review_id: reviewId, content: conteudo },
      select: { id: true, content: true, created_at: true, user: autorSelecionado },
    });
  }

  deleteOwnComment(userId: string, id: string) {
    return this.prisma.reviewComment.deleteMany({ where: { id, user_id: userId } });
  }

  findUserIdByUsername(username: string) {
    return this.prisma.profile.findUnique({ where: { username }, select: { user_id: true } });
  }
}
