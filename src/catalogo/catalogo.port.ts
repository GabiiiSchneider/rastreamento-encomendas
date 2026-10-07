export interface LivroCatalogo {
  externalId: string
  titulo: string
  autor: string
  // id do autor principal na Open Library (ex.: "OL93286A")
  autorId: string | null
  ano: number | null
  capaUrl: string | null
  genero: string | null
}

export interface DetalhesLivroCatalogo extends LivroCatalogo {
  descricao: string | null
  assuntos: string[]
}

export interface ResultadoBuscaCatalogo {
  livros: LivroCatalogo[]
  total: number
  pagina: number
  porPagina: number
}

export interface AutorCatalogo {
  id: string
  nome: string
  fotoUrl: string | null
  nascimento: string | null
  morte: string | null
  biografia: string | null
}

export interface ProvedorCatalogo {
  // idioma no formato do navegador (ex.: "pt-BR"); quando houver edição nesse idioma, o título vem dela
  buscarLivros(termo: string, pagina?: number, idioma?: string): Promise<ResultadoBuscaCatalogo>
  buscarPorId(externalId: string, idioma?: string): Promise<LivroCatalogo | null>
  buscarDetalhes(externalId: string, idioma?: string): Promise<DetalhesLivroCatalogo | null>
  buscarAutor(autorId: string): Promise<AutorCatalogo | null>
  // livros do autor, dos mais populares para os menos
  buscarLivrosDoAutor(autorId: string, pagina?: number, idioma?: string, limite?: number): Promise<ResultadoBuscaCatalogo>
}
