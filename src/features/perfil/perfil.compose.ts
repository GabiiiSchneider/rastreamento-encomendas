import { prisma } from "../../lib/prisma";
import { PerfilRepository } from "./perfil.repository";
import { PerfilService } from "./perfil.service";

export const perfilService = new PerfilService(new PerfilRepository(prisma));
