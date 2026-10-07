import type { ProvedorCatalogo } from './catalogo.port'
import { livros } from '../features/livros/livros.mock'

export const provedorCatalogoFake: ProvedorCatalogo = {
  async buscar(termo) {
    const busca = termo.toLowerCase()
    return livros.filter(
      (livro) =>
        livro.titulo.toLowerCase().includes(busca) ||
        livro.autor.toLowerCase().includes(busca),
    )
  },
}
