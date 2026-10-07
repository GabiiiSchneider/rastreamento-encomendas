const FORMATO_AUTOR_ID = /^OL\d+A$/;

export function autorIdValido(autorId: string) {
  return FORMATO_AUTOR_ID.test(autorId);
}
