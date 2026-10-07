import type { PrismaClient } from "../../generated/prisma/client";
import type { ReadingStatus } from "../../generated/prisma/enums";

type Periodo = {
  inicio: Date;
  fim: Date;
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
        profile: { select: { username: true, bio: true, favorite_genre: true } },
      },
    });
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
