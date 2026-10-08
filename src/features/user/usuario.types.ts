import type { ErrosCadastro } from "./cadastro.validacao";

export interface UsuarioLogado {
  id: string;
  nome: string;
  username: string | null;
  avatarUrl: string | null;
}

export type ResultadoCadastro =
  | { ok: true; userId: string }
  | { ok: false; erros: ErrosCadastro };
