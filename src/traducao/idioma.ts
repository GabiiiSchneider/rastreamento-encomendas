import { getRequestHeader } from '@tanstack/react-start/server'

const IDIOMA_PADRAO = 'pt-BR'
export function obterIdiomaDoNavegador(): string {
  const cabecalho = getRequestHeader('accept-language')
  if (!cabecalho) return IDIOMA_PADRAO

  const [preferido] = cabecalho
    .split(',')
    .map((parte) => {
      const [tag, ...params] = parte.trim().split(';')
      const peso = params.find((p) => p.trim().startsWith('q='))
      return { tag: tag.trim(), q: peso ? Number(peso.trim().slice(2)) : 1 }
    })
    .filter(({ tag, q }) => tag && tag !== '*' && q > 0)
    .sort((a, b) => b.q - a.q)

  return preferido?.tag ?? IDIOMA_PADRAO
}
