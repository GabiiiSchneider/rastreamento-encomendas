import { abaValida, type AbaEstante } from "./livros.estante";

export type BuscaLivros = {
  q?: string;
  pagina?: number;
};

// a página do livro também guarda de onde a pessoa veio, para o "voltar" levar ao lugar certo
export type BuscaLivro = BuscaLivros & {
  de?: "estante" | "autor" | "pesquisa";
  aba?: AbaEstante;
  autor?: string;
};

const FORMATO_AUTOR_ID = /^OL\d+A$/;

export function validarBuscaLivros(search: Record<string, unknown>): BuscaLivros {
  const bruto = typeof search.q === "string" || typeof search.q === "number" ? String(search.q) : "";
  const q = bruto.trim();
  const pagina = Number(search.pagina);

  return {
    q: q || undefined,
    pagina: q && Number.isInteger(pagina) && pagina > 1 ? pagina : undefined,
  };
}

export function validarBuscaLivro(search: Record<string, unknown>): BuscaLivro {
  if (search.de === "estante") {
    return { de: "estante", aba: abaValida(search.aba) ? search.aba : undefined };
  }
  if (search.de === "autor" && typeof search.autor === "string" && FORMATO_AUTOR_ID.test(search.autor)) {
    return { de: "autor", autor: search.autor };
  }
  if (search.de === "pesquisa") {
    const { q } = validarBuscaLivros(search);
    return { de: "pesquisa", q };
  }
  return validarBuscaLivros(search);
}
