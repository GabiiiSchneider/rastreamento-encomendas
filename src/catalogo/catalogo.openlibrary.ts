import type { AutorCatalogo, DetalhesLivroCatalogo, LivroCatalogo, ProvedorCatalogo } from './catalogo.port.ts'

const URL_BASE = 'https://openlibrary.org'
const URL_BUSCA = `${URL_BASE}/search.json`
const URL_CAPA = 'https://covers.openlibrary.org/b/id'
const URL_FOTO_AUTOR = 'https://covers.openlibrary.org/a/id'
const CAMPOS = 'key,title,author_name,author_key,first_publish_year,cover_i,subject,editions,editions.title,editions.language'
const USER_AGENT = 'Estante/1.0 (rede social de leitores, projeto de estudo)'
const LIVROS_POR_PAGINA = 12
const LIMITE_MAXIMO = 50
// obras com mais autores que isso são coletâneas (ex.: "Great Short Stories of the World", com 70)
const MAXIMO_AUTORES_OBRA = 5
const LIMITE_ASSUNTOS = 8
const TEMPO_LIMITE_MS = 8000
const FORMATO_ID_OBRA = /^\/works\/OL\d+W$/
const FORMATO_ID_AUTOR = /^OL\d+A$/

type EdicaoOpenLibrary = {
  title?: string
  language?: string[]
}

type DocOpenLibrary = {
  key: string
  title?: string
  editions?: { docs?: EdicaoOpenLibrary[] }
  author_name?: string[]
  author_key?: string[]
  first_publish_year?: number
  cover_i?: number
  subject?: string[]
}

type RespostaBusca = {
  numFound?: number
  docs?: DocOpenLibrary[]
}

type ObraOpenLibrary = {
  title?: string
  description?: string | { value?: string }
  subjects?: string[]
  covers?: number[]
  first_publish_date?: string
  authors?: Array<{ author?: { key?: string } }>
}

type AutorOpenLibrary = {
  type?: { key?: string }
  location?: string
  name?: string
  bio?: string | { value?: string }
  birth_date?: string
  death_date?: string
  photos?: number[]
}

// a busca recebe o idioma em ISO 639-1 ("pt"), mas as edições vêm marcadas com o código MARC ("por")
const CODIGOS_MARC: Record<string, string> = {
  pt: 'por',
  en: 'eng',
  es: 'spa',
  fr: 'fre',
  de: 'ger',
  it: 'ita',
  nl: 'dut',
  ru: 'rus',
  ja: 'jpn',
  zh: 'chi',
}

function codigoIdioma(idioma?: string) {
  return idioma?.split('-')[0].toLowerCase() || undefined
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

function urlCapa(idCapa: number, tamanho: 'M' | 'L' = 'M') {
  return `${URL_CAPA}/${idCapa}-${tamanho}.jpg`
}

// com ?lang= a Open Library prioriza uma edição no idioma, mas pode cair em outra língua se não existir
function tituloNoIdioma(doc: DocOpenLibrary, idioma?: string): string | undefined {
  const marc = CODIGOS_MARC[codigoIdioma(idioma) ?? '']
  if (!marc) return undefined
  const edicao = doc.editions?.docs?.[0]
  return edicao?.language?.includes(marc) ? edicao.title : undefined
}

// em coautorias, autorPreferido faz o cartão mostrar o autor da página em vez do primeiro da lista
function paraLivroCatalogo(doc: DocOpenLibrary, idioma?: string, autorPreferido?: string): LivroCatalogo | null {
  if (!doc.key || !doc.title) return null
  const indiceAutor = Math.max(0, autorPreferido ? (doc.author_key?.indexOf(autorPreferido) ?? 0) : 0)
  return {
    externalId: doc.key,
    titulo: tituloNoIdioma(doc, idioma) ?? doc.title,
    autor: doc.author_name?.[indiceAutor] ?? doc.author_name?.[0] ?? 'Autor desconhecido',
    autorId: doc.author_key?.[indiceAutor] ?? null,
    ano: doc.first_publish_year ?? null,
    capaUrl: doc.cover_i ? urlCapa(doc.cover_i) : null,
    genero: extrairGenero(doc.subject),
  }
}

// a descrição pode vir como texto ou como { type, value }, às vezes com links em markdown e notas de fonte
function extrairDescricao(descricao: ObraOpenLibrary['description']): string | null {
  const texto = typeof descricao === 'string' ? descricao : descricao?.value
  if (!texto) return null

  const limpo = texto
    .split(/\r?\n-{3,}/)[0]
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\r\n/g, '\n')
    .trim()

  return limpo || null
}

function extrairAno(data?: string): number | null {
  const ano = data?.match(/\d{4}/)?.[0]
  return ano ? Number(ano) : null
}

// devolve null quando a Open Library responde 404
async function obterJson<T>(url: string): Promise<T | null> {
  let resposta: Response
  try {
    resposta = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    })
  } catch {
    throw new Error('Não foi possível conectar à Open Library. Tente novamente em instantes.')
  }

  if (resposta.status === 404) return null
  if (!resposta.ok) {
    throw new Error(`A Open Library respondeu com erro (${resposta.status}). Tente novamente em instantes.`)
  }

  return (await resposta.json()) as T
}

type OpcoesConsulta = {
  ordem?: string
  autorPreferido?: string
  semColetaneas?: boolean
}

async function consultar(q: string, limite: number, pagina = 1, idioma?: string, opcoes: OpcoesConsulta = {}) {
  const parametros = new URLSearchParams({ q, fields: CAMPOS, limit: String(limite), page: String(pagina) })
  if (opcoes.ordem) parametros.set('sort', opcoes.ordem)
  const lang = codigoIdioma(idioma)
  if (lang) parametros.set('lang', lang)
  const dados = await obterJson<RespostaBusca>(`${URL_BUSCA}?${parametros}`)
  const docs = (dados?.docs ?? []).filter((doc) => !opcoes.semColetaneas || (doc.author_key?.length ?? 0) <= MAXIMO_AUTORES_OBRA)

  return {
    livros: docs.map((doc) => paraLivroCatalogo(doc, idioma, opcoes.autorPreferido)).filter((livro) => livro !== null),
    total: dados?.numFound ?? 0,
  }
}

const MESES: Record<string, string> = {
  january: 'janeiro',
  february: 'fevereiro',
  march: 'março',
  april: 'abril',
  may: 'maio',
  june: 'junho',
  july: 'julho',
  august: 'agosto',
  september: 'setembro',
  october: 'outubro',
  november: 'novembro',
  december: 'dezembro',
}

// as datas de autores são texto livre ("21 June 1839", "June 21, 1839", "1839"); só traduz os formatos conhecidos
function formatarData(data?: string): string | null {
  const texto = data?.trim()
  if (!texto) return null

  const diaMesAno = texto.match(/^(\d{1,2}) ([A-Za-z]+),? (\d{3,4})$/)
  const mesDiaAno = texto.match(/^([A-Za-z]+) (\d{1,2}),? (\d{3,4})$/)
  const mesAno = texto.match(/^([A-Za-z]+),? (\d{3,4})$/)

  if (diaMesAno && MESES[diaMesAno[2].toLowerCase()]) return `${diaMesAno[1]} de ${MESES[diaMesAno[2].toLowerCase()]} de ${diaMesAno[3]}`
  if (mesDiaAno && MESES[mesDiaAno[1].toLowerCase()]) return `${mesDiaAno[2]} de ${MESES[mesDiaAno[1].toLowerCase()]} de ${mesDiaAno[3]}`
  if (mesAno && MESES[mesAno[1].toLowerCase()]) return `${MESES[mesAno[1].toLowerCase()]} de ${mesAno[2]}`
  return texto
}

function normalizarTitulo(titulo: string) {
  return titulo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
}

// a Open Library às vezes cadastra a mesma obra duas vezes (ex.: "Esaú e Jacó" e "Esau e Jacó")
function semTitulosRepetidos(livros: LivroCatalogo[]) {
  const vistos = new Set<string>()
  return livros.filter((livro) => {
    const chave = normalizarTitulo(livro.titulo)
    if (vistos.has(chave)) return false
    vistos.add(chave)
    return true
  })
}

async function obterAutorJson(autorId: string) {
  const autor = await obterJson<AutorOpenLibrary>(`${URL_BASE}/authors/${autorId}.json`)
  // autores mesclados viram um redirecionamento para o registro principal
  if (autor?.type?.key === '/type/redirect' && autor.location?.startsWith('/authors/')) {
    return obterJson<AutorOpenLibrary>(`${URL_BASE}${autor.location}.json`)
  }
  return autor
}

export const provedorCatalogoOpenLibrary: ProvedorCatalogo = {
  async buscarLivros(termo, pagina = 1, idioma) {
    const busca = termo.trim()
    const paginaValida = Math.max(1, Math.floor(pagina))
    if (!busca) return { livros: [], total: 0, pagina: paginaValida, porPagina: LIVROS_POR_PAGINA }

    const { livros, total } = await consultar(busca, LIVROS_POR_PAGINA, paginaValida, idioma)
    return { livros, total, pagina: paginaValida, porPagina: LIVROS_POR_PAGINA }
  },

  async buscarPorId(externalId, idioma) {
    if (!FORMATO_ID_OBRA.test(externalId)) return null
    const { livros } = await consultar(`key:"${externalId}"`, 1, 1, idioma)
    return livros[0] ?? null
  },

  async buscarDetalhes(externalId, idioma) {
    if (!FORMATO_ID_OBRA.test(externalId)) return null

    // a obra traz descrição e assuntos; a busca traz autor, ano e gênero já resolvidos
    const [obra, busca] = await Promise.all([
      obterJson<ObraOpenLibrary>(`${URL_BASE}${externalId}.json`),
      consultar(`key:"${externalId}"`, 1, 1, idioma),
    ])
    if (!obra?.title) return null

    const resumo = busca.livros[0]
    const idCapa = obra.covers?.find((id) => id > 0)
    const detalhes: DetalhesLivroCatalogo = {
      externalId,
      titulo: resumo?.titulo ?? obra.title,
      autor: resumo?.autor ?? 'Autor desconhecido',
      autorId: resumo?.autorId ?? obra.authors?.[0]?.author?.key?.replace('/authors/', '') ?? null,
      ano: resumo?.ano ?? extrairAno(obra.first_publish_date),
      capaUrl: idCapa ? urlCapa(idCapa, 'L') : (resumo?.capaUrl?.replace('-M.jpg', '-L.jpg') ?? null),
      genero: resumo?.genero ?? extrairGenero(obra.subjects),
      descricao: extrairDescricao(obra.description),
      // ignora etiquetas internas da Open Library, como "series:Harry_Potter" ou "nyt:..."
      assuntos: (obra.subjects ?? []).filter((assunto) => !assunto.includes(':')).slice(0, LIMITE_ASSUNTOS),
    }
    return detalhes
  },

  async buscarAutor(autorId) {
    if (!FORMATO_ID_AUTOR.test(autorId)) return null

    const autor = await obterAutorJson(autorId)
    if (!autor?.name) return null

    const idFoto = autor.photos?.find((id) => id > 0)
    const resultado: AutorCatalogo = {
      id: autorId,
      nome: autor.name,
      fotoUrl: idFoto ? `${URL_FOTO_AUTOR}/${idFoto}-M.jpg` : null,
      nascimento: formatarData(autor.birth_date),
      morte: formatarData(autor.death_date),
      biografia: extrairDescricao(autor.bio),
    }
    return resultado
  },

  // testado: /authors/{id}/works.json não ordena e traz traduções como obras separadas;
  // a busca por author_key agrupa as edições na obra e ordena por popularidade com sort=readinglog.
  // coletâneas saem da lista, então algumas páginas podem vir com um ou dois livros a menos
  async buscarLivrosDoAutor(autorId, pagina = 1, idioma, limite = LIVROS_POR_PAGINA) {
    const paginaValida = Math.max(1, Math.floor(pagina))
    const limiteValido = Math.min(LIMITE_MAXIMO, Math.max(1, Math.floor(limite)))
    if (!FORMATO_ID_AUTOR.test(autorId)) return { livros: [], total: 0, pagina: paginaValida, porPagina: limiteValido }

    const { livros, total } = await consultar(`author_key:${autorId}`, limiteValido, paginaValida, idioma, {
      ordem: 'readinglog',
      autorPreferido: autorId,
      semColetaneas: true,
    })
    return { livros: semTitulosRepetidos(livros), total, pagina: paginaValida, porPagina: limiteValido }
  },
}
