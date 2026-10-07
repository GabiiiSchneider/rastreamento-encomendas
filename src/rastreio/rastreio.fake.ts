import type { ProvedorRastreio } from './rastreio.port'
import { encomendas } from '../features/encomendas/encomendas.mock'

export const provedorRastreioFake: ProvedorRastreio = {
  async rastrear(codigo) {
    return encomendas.find((encomenda) => encomenda.codigo === codigo)
  },
}
