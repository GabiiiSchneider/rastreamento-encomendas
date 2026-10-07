import type { LivroCatalogo, ProvedorCatalogo } from './catalogo.port.ts'

const URL_BUSCA = 'https://openlibrary.org/search.json'
const URL_CAPA = 'https://covers.openlibrary.org/b/id'
const CAMPOS = 'key,title,author_name,first_publish_year,cover_i,subject'
const USER_AGENT = 'Estante/1.0 (rede social de leitores, projeto de estudo)'
const LIMITE_BUSCA = 20
const TEMPO_LIMITE_MS = 8000

type DocOpenLibrary = {
  key: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  subject?: string[]
}

const GENEROS: Array<[string[], string]> = [
  [['dystopia'], 'Distopia'],
  [['science fiction'], 'Ficção científica'],
  [['fantasy'], 'Fantasia'],
  [['love stories', 'romance'], 'Romance'],
  [['detective', 'mystery'], 'Mistério'],
  [['horror'], 'Terror'],
  [['poetry'], 'Poesia'],
  [['biography'], 'Biografia'],
  [['juvenile fiction', "children's"], 'Infantojuvenil'],
  [['historical fiction'], 'Ficção histórica'],
  [['fiction'], 'Ficção'],
]

function extrairGenero(assuntos: string[] = []): string | null {
  const normalizados = assuntos.map((assunto) => assunto.toLowerCase())
  for (const [palavras, genero] of GENEROS) {
    if (normalizados.some((assunto) => palavras.some((palavra) => assunto.includes(palavra)))) {
      return genero
    }
  }
  return null
}

function paraLivroCatalogo(doc: DocOpenLibrary): LivroCatalogo | null {
  if (!doc.key || !doc.title) return null
  return {
    externalId: doc.key,
    titulo: doc.title,
    autor: doc.author_name?.[0] ?? 'Autor desconhecido',
    ano: doc.first_publish_year ?? null,
    capaUrl: doc.cover_i ? `${URL_CAPA}/${doc.cover_i}-M.jpg` : null,
    genero: extrairGenero(doc.subject),
  }
}

async function consultar(q: string, limite: number): Promise<LivroCatalogo[]> {
  const url = `${URL_BUSCA}?${new URLSearchParams({ q, fields: CAMPOS, limit: String(limite) })}`

  let resposta: Response
  try {
    resposta = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    })
  } catch {
    throw new Error('Não foi possível conectar à Open Library. Tente novamente em instantes.')
  }

  if (!resposta.ok) {
    throw new Error(`A Open Library respondeu com erro (${resposta.status}). Tente novamente em instantes.`)
  }

  const dados = (await resposta.json()) as { docs?: DocOpenLibrary[] }
  return (dados.docs ?? []).map(paraLivroCatalogo).filter((livro) => livro !== null)
}

export const provedorCatalogoOpenLibrary: ProvedorCatalogo = {
  async buscarLivros(termo) {
    const busca = termo.trim()
    if (!busca) return []
    return consultar(busca, LIMITE_BUSCA)
  },

  async buscarPorId(externalId) {
    if (!/^\/works\/OL\d+W$/.test(externalId)) return null
    const [livro] = await consultar(`key:"${externalId}"`, 1)
    return livro ?? null
  },
}
