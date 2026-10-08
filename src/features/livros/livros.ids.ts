const FORMATO_LIVRO_ID = /^OL\d+W$/;
const PREFIXO_OBRA = "/works/";

export function livroIdValido(livroId: string) {
  return FORMATO_LIVRO_ID.test(livroId);
}

export function paraExternalId(livroId: string) {
  return `${PREFIXO_OBRA}${livroId}`;
}

export function paraLivroId(externalId: string) {
  return externalId.replace(PREFIXO_OBRA, "");
}
