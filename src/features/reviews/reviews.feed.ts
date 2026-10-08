export const ABAS_FEED = [
  { valor: "novidades", rotulo: "Novidades" },
  { valor: "seguindo", rotulo: "Seguindo" },
  { valor: "resenhas", rotulo: "Resenhas" },
] as const;

export const FILTROS_SPOILER = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "sem-spoiler", rotulo: "Sem spoiler" },
  { valor: "com-spoiler", rotulo: "Com spoiler" },
] as const;

export type AbaFeed = (typeof ABAS_FEED)[number]["valor"];
export type FiltroSpoiler = (typeof FILTROS_SPOILER)[number]["valor"];

export type BuscaFeed = {
  aba?: AbaFeed;
  filtro?: FiltroSpoiler;
};

export function abaFeedValida(valor: unknown): valor is AbaFeed {
  return ABAS_FEED.some((aba) => aba.valor === valor);
}

export function filtroSpoilerValido(valor: unknown): valor is FiltroSpoiler {
  return FILTROS_SPOILER.some((filtro) => filtro.valor === valor);
}

export function validarBuscaFeed(search: Record<string, unknown>): BuscaFeed {
  const aba = abaFeedValida(search.aba) && search.aba !== "novidades" ? search.aba : undefined;
  const filtro = aba === "resenhas" && filtroSpoilerValido(search.filtro) && search.filtro !== "todas" ? search.filtro : undefined;
  return { aba, filtro };
}
