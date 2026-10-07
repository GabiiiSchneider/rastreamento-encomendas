import type { Encomenda } from '../features/encomendas/encomendas.types'
 
export const encomendas: Encomenda[] = [
  {
    codigo: 'BR123',
    origem: 'São Paulo',
    destino: 'Itajaí',
    status: 'Em trânsito',
  },
  {
    codigo: 'BR456',
    origem: 'Curitiba',
    destino: 'Itajaí',
    status: 'Entregue',
  },
]