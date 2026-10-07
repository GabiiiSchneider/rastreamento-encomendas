import type { ReadingStatus } from "../../generated/prisma/enums";

export const ABAS_ESTANTE = [
  {
    valor: "lidos-no-mes",
    rotulo: "Lidos no mês",
    status: "READ",
    somenteEsteMes: true,
    vazio: { titulo: "Nenhuma leitura terminada neste mês", texto: "Quando você marcar um livro como lido, ele aparece aqui." },
  },
  {
    valor: "total-lidos",
    rotulo: "Total lidos",
    status: "READ",
    somenteEsteMes: false,
    vazio: { titulo: "Nenhum livro lido por aqui ainda", texto: "Quando você terminar uma leitura, ela aparece nesta estante." },
  },
  {
    valor: "quero-ler",
    rotulo: "Quero ler",
    status: "WANT_TO_READ",
    somenteEsteMes: false,
    vazio: { titulo: "Sua lista de desejos está vazia", texto: "Guarde aqui os livros que você quer ler um dia." },
  },
  {
    valor: "lendo",
    rotulo: "Lendo agora",
    status: "READING",
    somenteEsteMes: false,
    vazio: { titulo: "Nenhuma leitura em andamento", texto: "Que tal começar um livro novo?" },
  },
] as const satisfies ReadonlyArray<{
  valor: string;
  rotulo: string;
  status: ReadingStatus;
  somenteEsteMes: boolean;
  vazio: { titulo: string; texto: string };
}>;

export type AbaEstante = (typeof ABAS_ESTANTE)[number]["valor"];

export const ABA_PADRAO: AbaEstante = "total-lidos";

export type BuscaEstante = {
  aba?: AbaEstante;
  pagina?: number;
};

export function abaValida(valor: unknown): valor is AbaEstante {
  return ABAS_ESTANTE.some((aba) => aba.valor === valor);
}

export function dadosDaAba(aba: AbaEstante) {
  return ABAS_ESTANTE.find((item) => item.valor === aba) ?? ABAS_ESTANTE[1];
}

export function validarBuscaEstante(search: Record<string, unknown>): BuscaEstante {
  const pagina = Number(search.pagina);
  return {
    aba: abaValida(search.aba) ? search.aba : undefined,
    pagina: Number.isInteger(pagina) && pagina > 1 ? pagina : undefined,
  };
}

export function periodoDoMes(data: Date) {
  const ano = data.getFullYear();
  const mes = data.getMonth();
  return { inicio: new Date(ano, mes, 1), fim: new Date(ano, mes + 1, 1) };
}
