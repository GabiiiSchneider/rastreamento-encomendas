import type { Livro } from '../features/livros/livros.types'

export interface ProvedorCatalogo {
  buscar(termo: string): Promise<Livro[]>
}
