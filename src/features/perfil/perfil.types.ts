import type { ErrosPerfil } from "./perfil.validacao";

export interface EstatisticasLeitura {
  lidosNoMes: number;
  totalLidos: number;
  queroLer: number;
  lendo: number;
}

export interface MetaLeitura {
  ano: number;
  objetivo: number;
  lidos: number;
}

export interface PerfilUsuario {
  nome: string;
  usuario: string | null;
  bio: string | null;
  generoFavorito: string | null;
  avatarUrl: string | null;
  estatisticas: EstatisticasLeitura;
  meta: MetaLeitura | null;
}

// o mínimo que o Header precisa para mostrar o avatar
export interface ResumoUsuario {
  nome: string;
  avatarUrl: string | null;
}

export type ResultadoEdicao = { ok: true } | { ok: false; erros: ErrosPerfil; mensagem?: string };

export type ResultadoAvatar = { ok: true } | { ok: false; mensagem: string };
