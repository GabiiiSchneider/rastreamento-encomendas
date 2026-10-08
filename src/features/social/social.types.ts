export interface Leitor {
  id: string;
  nome: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  resenhas: number;
  seguidores: number;
  euSigo: boolean;
  ehVoce: boolean;
}

export interface PaginaLeitores {
  leitores: Leitor[];
  total: number;
  pagina: number;
  porPagina: number;
}

export type TipoConexao = "seguidores" | "seguindo";

export type ResultadoSeguir = { ok: true; seguindo: boolean; seguidores: number } | { ok: false; mensagem: string };
