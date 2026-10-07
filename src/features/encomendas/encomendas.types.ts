export interface Encomenda {
    codigo: string
    origem: string
    destino: string
    status: string
}
export type EncomendasData = Encomenda []