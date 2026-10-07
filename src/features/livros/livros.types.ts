export interface LivroNaEstante {
    id: string
    externalId: string
    titulo: string
    autor: string
    ano: number | null
    genero: string | null
    capaUrl: string | null
}

export interface PaginaEstante {
    livros: LivroNaEstante[]
    total: number
    pagina: number
    porPagina: number
}
