import type { ProvedorCatalogo } from './catalogo.port.ts'
import { provedorCatalogoOpenLibrary } from './catalogo.openlibrary.ts'

export const provedorCatalogo: ProvedorCatalogo = provedorCatalogoOpenLibrary
