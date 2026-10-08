import type { PrismaClient } from "../../generated/prisma/client";

type DadosNovoUsuario = {
    name: string;
    username: string;
    email: string;
    passwordHash: string;
};

export class UsuarioRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: {email}});
    }
    emailExists(email: string) {
        return this.prisma.user.count({ where: { email } }).then((total) => total > 0);
    }
    usernameExists(username: string) {
        return this.prisma.profile.count({ where: { username } }).then((total) => total > 0);
    }
    createWithProfile(dados: DadosNovoUsuario) {
        return this.prisma.user.create({
            data: {
                name: dados.name,
                email: dados.email,
                password: dados.passwordHash,
                profile: { create: { username: dados.username } },
            },
            select: { id: true },
        });
    }
    findLoggedUser(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, profile: { select: { username: true, avatar_url: true } } },
        });
    }
}
