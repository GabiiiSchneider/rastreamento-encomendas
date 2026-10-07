import { prisma } from "../../lib/prisma.ts";
import { provedorCatalogo } from "../../catalogo/catalogo.compose.ts";
import { LivrosRepository } from "./livros.repository.ts";
import { LivrosService } from "./livros.service.ts";

export const livrosService = new LivrosService(new LivrosRepository(prisma), provedorCatalogo);
