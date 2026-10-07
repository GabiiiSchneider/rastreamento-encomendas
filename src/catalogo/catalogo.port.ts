export interface LivroCatalogo {
  externalId: string
  titulo: string
  autor: string
  ano: number | null
  capaUrl: string | null
  genero: string | null
}

export interface ProvedorCatalogo {
  buscarLivros(termo: string): Promise<LivroCatalogo[]>
  buscarPorId(externalId: string): Promise<LivroCatalogo | null>
}
