import { prisma } from "../../lib/prisma";
import { UsuarioRepository } from "./usuario.repository";
import { AuthService } from "./auth.service";

export const authService = new AuthService(new UsuarioRepository(prisma));