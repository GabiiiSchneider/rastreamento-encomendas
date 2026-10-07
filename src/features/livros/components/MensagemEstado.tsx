import type { ReactNode } from "react";
import { Paper, Typography } from "@mui/material";
import { cores, fontes } from "../../../lib/tema";

type Props = {
  titulo: string;
  texto: string;
  acao?: ReactNode;
};

export function MensagemEstado({ titulo, texto, acao }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: cores.fundo,
        border: `2px dashed ${cores.textoSuave}`,
        borderRadius: 4,
        px: 3,
        py: 5,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: cores.tinta }}>
        {titulo}
      </Typography>
      <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave, mt: 1, maxWidth: 480, mx: "auto" }}>
        {texto}
      </Typography>
      {acao}
    </Paper>
  );
}
