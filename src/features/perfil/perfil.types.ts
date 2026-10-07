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
  estatisticas: EstatisticasLeitura;
  meta: MetaLeitura | null;
}
