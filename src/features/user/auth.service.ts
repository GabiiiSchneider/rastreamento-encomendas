import bcrypt from "bcryptjs";
import type { UsuarioRepository } from "./usuario.repository";
import type { CreateUserDto, LoginDto } from "./auth.dto";
import type { UsuarioLogado } from "./usuario.types";

export class AuthService {
  private repository: UsuarioRepository;

  constructor(repository: UsuarioRepository) {
    this.repository = repository;
  }

  async cadastrar(dto: CreateUserDto) {
    const existe = await this.repository.findByEmail(dto.email);
    if (existe) {
      throw new Error("E-mail já cadastrado");
    }
    const senhaHash = await bcrypt.hash(dto.password, 10);
    const user = await this.repository.create({ ...dto, password: senhaHash });
    const { password: _, ...usuarioSemSenha } = user;
    return usuarioSemSenha;
  }

    async login(dto: LoginDto) {
    const user = await this.repository.findByEmail(dto.email);
    if (!user) {
      throw new Error("E-mail ou senha inválidos");
    }
    const senhaCorreta = await bcrypt.compare(dto.password, user.password);
    if (!senhaCorreta) {
      throw new Error("E-mail ou senha inválidos");
    }
    const { password: _, ...usuarioSemSenha } = user;
    return usuarioSemSenha;
  }

  async obterUsuarioLogado(userId: string): Promise<UsuarioLogado | null> {
    const usuario = await this.repository.findLoggedUser(userId);
    if (!usuario) return null;
    return {
      id: usuario.id,
      nome: usuario.name,
      username: usuario.profile?.username ?? null,
      avatarUrl: usuario.profile?.avatar_url ?? null,
    };
  }
}
