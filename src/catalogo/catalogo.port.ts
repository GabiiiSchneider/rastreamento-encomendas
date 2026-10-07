export interface LivroCatalogo {
  externalId: string
  titulo: string
  autor: string
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

export interface ProvedorCatalogo {
  // idioma no formato do navegador (ex.: "pt-BR"); quando houver edição nesse idioma, o título vem dela
  buscarLivros(termo: string, pagina?: number, idioma?: string): Promise<ResultadoBuscaCatalogo>
  buscarPorId(externalId: string, idioma?: string): Promise<LivroCatalogo | null>
  buscarDetalhes(externalId: string, idioma?: string): Promise<DetalhesLivroCatalogo | null>
}
