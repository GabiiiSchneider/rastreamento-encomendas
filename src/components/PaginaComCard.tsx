import type { ReactNode } from "react";
import { Box, Paper } from "@mui/material";
import { Header } from "./Header";
import { FundoPapel } from "./FundoPapel";
import { cores, retro } from "../lib/tema";
import { ALTURA_NAVEGACAO_INFERIOR } from "../features/feed/components/NavegacaoInferior";

type Props = {
  children: ReactNode;
};
export function PaginaComCard({ children }: Props) {
  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: cores.fundo,
          px: 2,
          pt: { xs: 3, md: 6 },
          pb: { xs: `${ALTURA_NAVEGACAO_INFERIOR + 24}px`, md: 6 },
        }}
      >
        <FundoPapel />

        <Paper
          elevation={0}
          sx={{
            position: "relative",
            mx: "auto",
            width: "100%",
            maxWidth: 1200,
            backgroundColor: cores.papel,
            border: retro.borda,
            boxShadow: retro.sombra,
            borderRadius: 8,
            p: { xs: 2.5, md: 4 },
          }}
        >
          {children}
        </Paper>
      </Box>
    </>
  );
}
