import { cores } from "../../../lib/tema";

export type EstiloCapa = {
  fundo: string;
  texto: string;
  chipFundo: string;
  chipTexto: string;
};
export const estilosCartao: EstiloCapa[] = [
  { fundo: cores.terracotaEscura, texto: cores.papel, chipFundo: cores.papel, chipTexto: cores.tinta },
  { fundo: cores.mostarda, texto: cores.tinta, chipFundo: cores.tinta, chipTexto: cores.papel },
  { fundo: cores.rosa, texto: cores.tinta, chipFundo: cores.papel, chipTexto: cores.tinta },
  { fundo: cores.azul, texto: cores.tinta, chipFundo: cores.tinta, chipTexto: cores.papel },
];

export const estiloComCapa: EstiloCapa = { fundo: cores.tinta, texto: cores.papel, chipFundo: cores.papel, chipTexto: cores.tinta };

export function estiloDoLivro(capaUrl: string | null, indice: number) {
  return capaUrl ? estiloComCapa : estilosCartao[indice % estilosCartao.length];
}

export function indiceDoId(id: string) {
  let soma = 0;
  for (const letra of id) soma += letra.charCodeAt(0);
  return soma;
}
