import type { Prisma, PrismaClient } from "../../generated/prisma/client";

function selecaoLeitor(viewerId: string) {
  return {
    id: true,
    name: true,
    profile: { select: { username: true, avatar_url: true, bio: true } },
    followers: { where: { follower_id: viewerId }, select: { follower_id: true } },
    _count: { select: { reviews: true, followers: true } },
  } satisfies Prisma.UserSelect;
}

export type LeitorDoBanco = Prisma.UserGetPayload<{ select: ReturnType<typeof selecaoLeitor> }>;

const comPerfil: Prisma.UserWhereInput = { profile: { isNot: null } };

export class SocialRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  userExists(id: string) {
    return this.prisma.user.count({ where: { id } }).then((total) => total > 0);
  }

  createFollow(followerId: string, followingId: string) {
    return this.prisma.follow.create({ data: { follower_id: followerId, following_id: followingId } });
  }

  deleteFollow(followerId: string, followingId: string) {
    return this.prisma.follow.deleteMany({ where: { follower_id: followerId, following_id: followingId } });
  }

  countFollowers(userId: string) {
    return this.prisma.follow.count({ where: { following_id: userId } });
  }

  findSuggestions(viewerId: string, take: number) {
    return this.prisma.user.findMany({
      where: { ...comPerfil, id: { not: viewerId }, followers: { none: { follower_id: viewerId } } },
      orderBy: [{ reviews: { _count: "desc" } }, { followers: { _count: "desc" } }, { created_at: "desc" }],
      take,
      select: selecaoLeitor(viewerId),
    });
  }

  async searchReaders(viewerId: string, termo: string, skip: number, take: number) {
    const contem = { contains: termo, mode: "insensitive" as const };
    const where: Prisma.UserWhereInput = {
      ...comPerfil,
      OR: [{ name: contem }, { profile: { username: contem } }],
    };
    const [leitores, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: [{ followers: { _count: "desc" } }, { name: "asc" }],
        skip,
        take,
        select: selecaoLeitor(viewerId),
      }),
      this.prisma.user.count({ where }),
    ]);
    return { leitores, total };
  }

  findUserIdByUsername(username: string) {
    return this.prisma.profile.findUnique({ where: { username }, select: { user_id: true } });
  }

  findConnections(viewerId: string, userId: string, tipo: "seguidores" | "seguindo", take: number) {
    const where: Prisma.UserWhereInput =
      tipo === "seguidores" ? { following: { some: { following_id: userId } } } : { followers: { some: { follower_id: userId } } };
    return this.prisma.user.findMany({
      where: { ...comPerfil, ...where },
      orderBy: { name: "asc" },
      take,
      select: selecaoLeitor(viewerId),
    });
  }
}
