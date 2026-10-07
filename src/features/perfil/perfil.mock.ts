export type LivroLido = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
};

export type EstatisticasUsuario = {
  lidosNoMes: number;
  totalLidos: number;
  queroLer: number;
  resenhas: number;
};

export type MetaLeitura = {
  ano: number;
  objetivo: number;
  lidos: number;
};

export type PerfilUsuario = {
  nome: string;
  usuario: string;
  bio: string;
  generoFavorito: string;
  estatisticas: EstatisticasUsuario;
  meta: MetaLeitura;
  livrosLidos: LivroLido[];
};

// dados de exemplo enquanto o perfil ainda não vem do banco
export const perfilMock: PerfilUsuario = {
  nome: "Gabriela Pires",
  usuario: "gabi.le",
  bio: "Leitora compulsiva, colecionadora de marcadores e defensora de que todo livro merece uma segunda chance. Amo clássicos brasileiros, distopias e histórias que me fazem chorar no ônibus.",
  generoFavorito: "Romance",
  estatisticas: {
    lidosNoMes: 3,
    totalLidos: 42,
    queroLer: 18,
    resenhas: 12,
  },
  meta: {
    ano: 2026,
    objetivo: 30,
    lidos: 21,
  },
  livrosLidos: [
    { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", genero: "Clássico" },
    { id: 2, titulo: "1984", autor: "George Orwell", genero: "Distopia" },
    { id: 3, titulo: "Torto Arado", autor: "Itamar Vieira Junior", genero: "Romance" },
    { id: 4, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", genero: "Fábula" },
    { id: 5, titulo: "Orgulho e Preconceito", autor: "Jane Austen", genero: "Romance" },
    { id: 6, titulo: "A Hora da Estrela", autor: "Clarice Lispector", genero: "Clássico" },
  ],
};
