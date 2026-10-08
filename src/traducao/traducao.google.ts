import type { Tradutor } from './traducao.port.ts'
const URL_TRADUCAO = 'https://translate.googleapis.com/translate_a/single'
const TEMPO_LIMITE_MS = 5000
const LIMITE_CACHE = 1000

type Segmento = [traduzido: string, original: string, ...resto: unknown[]]
type RespostaTraducao = [Segmento[] | null, ...resto: unknown[]]

const cache = new Map<string, string>()

function guardarNoCache(chave: string, valor: string) {
  if (cache.size >= LIMITE_CACHE) {
    const maisAntiga = cache.keys().next().value
    if (maisAntiga !== undefined) cache.delete(maisAntiga)
  }
  cache.set(chave, valor)
}

async function traduzirTexto(texto: string, idioma: string): Promise<string> {
  const chave = `${idioma}:${texto}`
  const emCache = cache.get(chave)
  if (emCache !== undefined) return emCache

  try {
    const parametros = new URLSearchParams({ client: 'gtx', sl: 'auto', tl: idioma, dt: 't' })
    const resposta = await fetch(`${URL_TRADUCAO}?${parametros}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ q: texto }),
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    })
    if (!resposta.ok) return texto

    const [segmentos] = (await resposta.json()) as RespostaTraducao
    const traduzido = (segmentos ?? []).map(([parte]) => parte).join('')
    if (!traduzido) return texto

    guardarNoCache(chave, traduzido)
    return traduzido
  } catch {
    return texto
  }
}

export const tradutorGoogle: Tradutor = {
  async traduzir(textos, idioma) {
    if (textos.length === 0) return []

    // textos de uma linha (como os assuntos) vão juntos numa só requisição, separados por quebra de linha
    if (textos.length > 1 && textos.every((texto) => texto.trim() && !texto.includes('\n'))) {
      const traduzidos = (await traduzirTexto(textos.join('\n'), idioma)).split('\n').map((texto) => texto.trim())
      if (traduzidos.length === textos.length) return traduzidos
      return textos
    }

    const traduzidos: string[] = []
    for (const texto of textos) {
      traduzidos.push(texto.trim() ? await traduzirTexto(texto, idioma) : texto)
    }
    return traduzidos
  },
}
