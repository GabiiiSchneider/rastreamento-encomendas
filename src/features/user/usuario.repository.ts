import type { PrismaClient } from "../../generated/prisma/client";
import type { CreateUserDto } from "./auth.dto";

export class UsuarioRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: {email}});
    }
    create(data: CreateUserDto) {
        return this.prisma.user.create({ data });
    }
}