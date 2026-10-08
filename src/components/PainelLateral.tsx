import type { ReactNode } from "react";
import { Paper, Typography } from "@mui/material";
import { cores, fontes, retro } from "../lib/tema";

type Props = {
  titulo: string;
  children: ReactNode;
};

export function PainelLateral({ titulo, children }: Props) {
  return (
    <Paper
      component="section"
      elevation={0}
      sx={{ backgroundColor: cores.papel, border: retro.borda, boxShadow: retro.sombraLeve, borderRadius: 5, p: 2.5 }}
    >
      <Typography component="h2" sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: cores.tinta, lineHeight: 1.1, mb: 2 }}>
        {titulo}
      </Typography>
      {children}
    </Paper>
  );
}
