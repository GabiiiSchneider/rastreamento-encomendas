export interface AutorPublicacao {
  id: string;
  nome: string;
  username: string | null;
  avatarUrl: string | null;
}

export interface LivroResenha {
  externalId: string;
  titulo: string;
  autor: string;
  capaUrl: string | null;
}

export interface Resenha {
  id: string;
  conteudo: string;
  nota: number | null;
  temSpoiler: boolean;
  criadaEm: string;
  autor: AutorPublicacao;
  livro: LivroResenha;
  curtidas: number;
  comentarios: number;
  curtidaPorMim: boolean;
  minha: boolean;
}

export interface PaginaResenhas {
  resenhas: Resenha[];
  proximoCursor: string | null;
}

export interface Comentario {
  id: string;
  conteudo: string;
  criadoEm: string;
  autor: AutorPublicacao;
  meu: boolean;
}

export type ResultadoAcao<T> = { ok: true; valor: T } | { ok: false; mensagem: string };
