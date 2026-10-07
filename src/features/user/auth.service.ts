import bcrypt from "bcryptjs";
import type { UsuarioRepository } from "./usuario.repository";
import type { CreateUserDto, LoginDto } from "./auth.dto";

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
}