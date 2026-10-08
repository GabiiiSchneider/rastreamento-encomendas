import type { SvgIconProps } from "@mui/material";
import { IconeCasa, IconeEstante, IconeLupa, IconePessoa } from "../../components/Icones";

export const ITENS_NAVEGACAO = [
  { rotulo: "Início", rota: "/home", Icone: IconeCasa },
  { rotulo: "Buscar", rota: "/buscar", Icone: IconeLupa },
  { rotulo: "Minha estante", rota: "/estante", Icone: IconeEstante },
  { rotulo: "Perfil", rota: "/perfil", Icone: IconePessoa },
] as const satisfies ReadonlyArray<{ rotulo: string; rota: string; Icone: (props: SvgIconProps) => React.JSX.Element }>;

export type RotaNavegacao = (typeof ITENS_NAVEGACAO)[number]["rota"];

export function itemAtivo(caminho: string): RotaNavegacao | null {
  return ITENS_NAVEGACAO.find((item) => caminho === item.rota || caminho.startsWith(`${item.rota}/`))?.rota ?? null;
}
