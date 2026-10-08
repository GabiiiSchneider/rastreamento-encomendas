import bcrypt from "bcryptjs";
import type { UsuarioRepository } from "./usuario.repository";
import type { CreateUserDto, LoginDto } from "./auth.dto";
import type { ResultadoCadastro, UsuarioLogado } from "./usuario.types";
import { normalizarCadastro, normalizarEmail, validarCadastro, type DadosCadastro, type ErrosCadastro } from "./cadastro.validacao";

const MENSAGEM_EMAIL_EM_USO = "Já existe uma conta com esse e-mail.";

function violouCampoUnico(erro: unknown) {
  return typeof erro === "object" && erro !== null && "code" in erro && erro.code === "P2002";
}

export class AuthService {
  private repository: UsuarioRepository;

  constructor(repository: UsuarioRepository) {
    this.repository = repository;
  }

  async cadastrar(dto: CreateUserDto): Promise<ResultadoCadastro> {
    const entrada: DadosCadastro = {
      nome: String(dto.name ?? ""),
      username: String(dto.username ?? ""),
      email: String(dto.email ?? ""),
      senha: String(dto.password ?? ""),
      confirmacao: String(dto.passwordConfirmation ?? ""),
    };
    const erros = validarCadastro(entrada);
    if (Object.keys(erros).length > 0) return { ok: false, erros };

    const { nome, username, email, senha } = normalizarCadastro(entrada);
    const duplicados = await this.camposEmUso(email, username);
    if (Object.keys(duplicados).length > 0) return { ok: false, erros: duplicados };

    try {
      const { id } = await this.repository.createWithProfile({
        name: nome,
        username,
        email,
        passwordHash: await bcrypt.hash(senha, 10),
      });
      return { ok: true, userId: id };
    } catch (erro) {
      if (!violouCampoUnico(erro)) throw erro;
      const emUso = await this.camposEmUso(email, username);
      return { ok: false, erros: Object.keys(emUso).length > 0 ? emUso : { email: MENSAGEM_EMAIL_EM_USO } };
    }
  }

  private async camposEmUso(email: string, username: string): Promise<ErrosCadastro> {
    const [emailEmUso, usernameEmUso] = await Promise.all([
      this.repository.emailExists(email),
      this.repository.usernameExists(username),
    ]);
    const erros: ErrosCadastro = {};
    if (emailEmUso) erros.email = MENSAGEM_EMAIL_EM_USO;
    if (usernameEmUso) erros.username = "Esse nome de usuário já está em uso. Escolha outro.";
    return erros;
  }

  async login(dto: LoginDto) {
    const user = await this.repository.findByEmail(normalizarEmail(String(dto.email ?? "")));
    if (!user) {
      throw new Error("E-mail ou senha inválidos");
    }
    const senhaCorreta = await bcrypt.compare(String(dto.password ?? ""), user.password);
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
