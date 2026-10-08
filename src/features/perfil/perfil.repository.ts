import type { PrismaClient } from "../../generated/prisma/client";
import type { ReadingStatus } from "../../generated/prisma/enums";

type Periodo = {
  inicio: Date;
  fim: Date;
};

type DadosEdicao = {
  nome: string;
  username: string;
  bio: string | null;
  generoFavorito: string | null;
};

export class PerfilRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findUserWithProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        profile: { select: { username: true, bio: true, favorite_genre: true, avatar_url: true } },
      },
    });
  }

  countFollowers(userId: string) {
    return this.prisma.follow.count({ where: { following_id: userId } });
  }

  countFollowing(userId: string) {
    return this.prisma.follow.count({ where: { follower_id: userId } });
  }

  countReviews(userId: string) {
    return this.prisma.review.count({ where: { user_id: userId } });
  }

  isFollowing(followerId: string, followingId: string) {
    return this.prisma.follow
      .count({ where: { follower_id: followerId, following_id: followingId } })
      .then((total) => total > 0);
  }

  findProfileByUsername(username: string) {
    return this.prisma.profile.findUnique({ where: { username }, select: { user_id: true } });
  }

  findProfileByUserId(userId: string) {
    return this.prisma.profile.findUnique({ where: { user_id: userId }, select: { id: true } });
  }

  // nome fica em User e o resto em Profile; o perfil é criado se ainda não existir
  updateUserAndProfile(userId: string, dados: DadosEdicao) {
    const perfil = { username: dados.username, bio: dados.bio, favorite_genre: dados.generoFavorito };
    return this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { name: dados.nome } }),
      this.prisma.profile.upsert({
        where: { user_id: userId },
        update: perfil,
        create: { user_id: userId, ...perfil },
      }),
    ]);
  }

  updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.profile.update({ where: { user_id: userId }, data: { avatar_url: avatarUrl } });
  }

  countUserBooks(userId: string, status: ReadingStatus, terminadosEm?: Periodo) {
    return this.prisma.userBook.count({
      where: {
        user_id: userId,
        status,
        ...(terminadosEm && { finished_at: { gte: terminadosEm.inicio, lt: terminadosEm.fim } }),
      },
    });
  }

  findGoal(userId: string, year: number) {
    return this.prisma.readingGoal.findUnique({
      where: { user_id_year: { user_id: userId, year } },
    });
  }
}
