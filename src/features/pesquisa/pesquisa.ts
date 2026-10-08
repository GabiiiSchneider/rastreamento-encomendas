export const TIPOS_PESQUISA = [
  { valor: "tudo", rotulo: "Tudo" },
  { valor: "livros", rotulo: "Livros" },
  { valor: "autores", rotulo: "Autores" },
  { valor: "resenhas", rotulo: "Resenhas" },
  { valor: "leitores", rotulo: "Leitores" },
] as const;

export type TipoPesquisa = (typeof TIPOS_PESQUISA)[number]["valor"];

export type BuscaPesquisa = {
  q?: string;
  tipo?: TipoPesquisa;
  pagina?: number;
};

export function tipoPesquisaValido(valor: unknown): valor is TipoPesquisa {
  return TIPOS_PESQUISA.some((tipo) => tipo.valor === valor);
}

export function validarBuscaPesquisa(search: Record<string, unknown>): BuscaPesquisa {
  const q = typeof search.q === "string" || typeof search.q === "number" ? String(search.q).trim() : "";
  const tipo = tipoPesquisaValido(search.tipo) && search.tipo !== "tudo" ? search.tipo : undefined;
  const pagina = Number(search.pagina);
  return {
    q: q || undefined,
    tipo,
    pagina: q && tipo && Number.isInteger(pagina) && pagina > 1 ? pagina : undefined,
  };
}
