import type { Encomenda } from '../features/encomendas/encomendas.types'

export interface ProvedorRastreio {
  rastrear(codigo: string): Promise<Encomenda | undefined>
}
