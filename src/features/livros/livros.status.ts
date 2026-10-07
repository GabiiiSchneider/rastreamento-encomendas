import type { ReadingStatus } from "../../generated/prisma/enums";

export const OPCOES_STATUS: Array<{ valor: ReadingStatus; rotulo: string }> = [
  { valor: "WANT_TO_READ", rotulo: "Quero ler" },
  { valor: "READING", rotulo: "Lendo" },
  { valor: "READ", rotulo: "Lido" },
];

export function rotuloDoStatus(status: ReadingStatus) {
  return OPCOES_STATUS.find((opcao) => opcao.valor === status)?.rotulo ?? status;
}
