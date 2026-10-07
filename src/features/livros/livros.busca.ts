export type BuscaLivros = {
  q?: string;
  pagina?: number;
};

export function validarBuscaLivros(search: Record<string, unknown>): BuscaLivros {
  const bruto = typeof search.q === "string" || typeof search.q === "number" ? String(search.q) : "";
  const q = bruto.trim();
  const pagina = Number(search.pagina);

  return {
    q: q || undefined,
    pagina: q && Number.isInteger(pagina) && pagina > 1 ? pagina : undefined,
  };
}
