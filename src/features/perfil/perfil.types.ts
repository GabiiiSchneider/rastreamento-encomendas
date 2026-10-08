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
  social: EstatisticasSociais;
  meta: MetaLeitura | null;
}

export interface EstatisticasSociais {
  seguidores: number;
  seguindo: number;
  resenhas: number;
}

export interface PerfilPublico extends PerfilUsuario {
  id: string;
  usuario: string;
  euSigo: boolean;
}

export type ResultadoEdicao = { ok: true } | { ok: false; erros: ErrosPerfil; mensagem?: string };

export type ResultadoAvatar = { ok: true } | { ok: false; mensagem: string };
