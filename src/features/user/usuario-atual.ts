import { prisma } from "../../lib/prisma";
import { UsuarioRepository } from "./usuario.repository";

const EMAIL_USUARIO_TEMPORARIO = "gabriela@teste.com";

const usuarioRepository = new UsuarioRepository(prisma);

export async function obterUsuarioAtualId() {
  const usuario = await usuarioRepository.findByEmail(EMAIL_USUARIO_TEMPORARIO);
  return usuario?.id ?? null;
}
