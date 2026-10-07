export interface Tradutor {
  traduzir(textos: string[], idioma: string): Promise<string[]>
}
