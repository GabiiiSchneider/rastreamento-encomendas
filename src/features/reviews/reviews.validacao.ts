export const LIMITES_RESENHA = {
  conteudoMax: 1000,
  comentarioMax: 500,
  notaMin: 1,
  notaMax: 5,
};

export const FORMATO_EXTERNAL_ID = /^\/works\/OL\d+W$/;

export type ErroValidacao = string | null;

export function validarConteudoResenha(conteudo: unknown): ErroValidacao {
  if (typeof conteudo !== "string" || conteudo.trim().length === 0) return "Escreva alguma coisa sobre o livro.";
  if (conteudo.trim().length > LIMITES_RESENHA.conteudoMax) return `A resenha pode ter no máximo ${LIMITES_RESENHA.conteudoMax} caracteres.`;
  return null;
}

export function validarNota(nota: unknown): ErroValidacao {
  if (nota === null || nota === undefined) return null;
  if (typeof nota !== "number" || !Number.isInteger(nota) || nota < LIMITES_RESENHA.notaMin || nota > LIMITES_RESENHA.notaMax) {
    return `A nota precisa ser um número inteiro de ${LIMITES_RESENHA.notaMin} a ${LIMITES_RESENHA.notaMax}.`;
  }
  return null;
}

export function validarComentario(conteudo: unknown): ErroValidacao {
  if (typeof conteudo !== "string" || conteudo.trim().length === 0) return "Escreva um comentário.";
  if (conteudo.trim().length > LIMITES_RESENHA.comentarioMax) return `O comentário pode ter no máximo ${LIMITES_RESENHA.comentarioMax} caracteres.`;
  return null;
}
