import type { Livro } from './livros.types'
import { cores } from '../../lib/tema'

export const livros: Livro[] = [
  {
    id: 'dom-casmurro',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    ano: 1899,
    capa: cores.terracota,
  },
  {
    id: 'a-hora-da-estrela',
    titulo: 'A Hora da Estrela',
    autor: 'Clarice Lispector',
    ano: 1977,
    capa: cores.rosa,
  },
  {
    id: '1984',
    titulo: '1984',
    autor: 'George Orwell',
    ano: 1949,
    capa: cores.tinta,
  },
  {
    id: 'orgulho-e-preconceito',
    titulo: 'Orgulho e Preconceito',
    autor: 'Jane Austen',
    ano: 1813,
    capa: cores.mostarda,
  },
  {
    id: 'o-pequeno-principe',
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    ano: 1943,
    capa: cores.azul,
  },
]
