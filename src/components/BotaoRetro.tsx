import { Button, type ButtonProps } from "@mui/material";
import { cores, fontes, retro } from "../lib/tema";

type Props = Omit<ButtonProps, "variant"> & {
  variante?: "primario" | "secundario";
};

const base = {
  borderRadius: 3,
  px: 3,
  py: 1.1,
  fontFamily: fontes.corpo,
  fontWeight: 700,
  fontSize: "1rem",
  textTransform: "none",
  whiteSpace: "nowrap",
  transition: "transform 0.15s, box-shadow 0.15s",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
} as const;

const variantes = {
  primario: {
    ...base,
    backgroundColor: cores.mostarda,
    color: cores.tinta,
    boxShadow: `4px 4px 0 ${cores.terracota}`,
    "&:hover": {
      backgroundColor: cores.mostardaEscura,
      transform: "translate(-1px, -1px)",
      boxShadow: `5px 5px 0 ${cores.terracota}`,
    },
    "&.Mui-disabled": { backgroundColor: cores.mostarda, color: cores.tinta, opacity: 0.6 },
  },
  secundario: {
    ...base,
    backgroundColor: cores.papel,
    color: cores.tinta,
    border: retro.borda,
    boxShadow: retro.sombraLeve,
    "&:hover": {
      backgroundColor: cores.fundo,
      transform: "translate(-1px, -1px)",
      boxShadow: `4px 4px 0 ${cores.tinta}`,
    },
    "&.Mui-disabled": { color: cores.tinta, border: retro.borda, opacity: 0.6 },
  },
};

export function BotaoRetro({ variante = "primario", sx, ...props }: Props) {
  return <Button {...props} sx={[variantes[variante], ...(Array.isArray(sx) ? sx : [sx])]} />;
}
