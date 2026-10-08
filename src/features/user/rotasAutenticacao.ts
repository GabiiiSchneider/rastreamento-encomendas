export type BuscaAutenticacao = { redirect?: string };

export function destinoSeguro(valor: unknown) {
  return typeof valor === "string" && valor.startsWith("/") && !valor.startsWith("//") ? valor : undefined;
}

export function validarBuscaAutenticacao(search: Record<string, unknown>): BuscaAutenticacao {
  return { redirect: destinoSeguro(search.redirect) };
}
