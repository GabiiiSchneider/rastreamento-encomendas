import type { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { Header } from "../../../components/Header";
import { FundoPapel } from "../../../components/FundoPapel";
import { cores, fontes, retro } from "../../../lib/tema";
import { ALTURA_NAVEGACAO_INFERIOR } from "../../feed/components/NavegacaoInferior";

type Props = {
  titulo: ReactNode;
  subtitulo: string;
  principal: ReactNode;
  lateral: ReactNode;
  depois?: ReactNode;
};

export function LayoutPerfil({ titulo, subtitulo, principal, lateral, depois }: Props) {
  return (
    <>
      <Header />
      <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden", backgroundColor: cores.fundo, px: 2, pt: { xs: 3, md: 6 }, pb: { xs: `${ALTURA_NAVEGACAO_INFERIOR + 24}px`, md: 6 } }}>
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
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 320px" },
            gap: 4,
          }}
        >
          <Stack sx={{ gap: 4, order: { xs: 2, md: 1 }, minWidth: 0 }}>
            <Box>
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
                {typeof titulo === "string" ? <TituloPerfil>{titulo}</TituloPerfil> : titulo}
              </Stack>
              <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.textoSuave, mt: 1 }}>{subtitulo}</Typography>
            </Box>
            {principal}
          </Stack>

          <Box sx={{ order: { xs: 1, md: 2 } }}>{lateral}</Box>
        </Paper>
      </Box>
      {depois}
    </>
  );
}

export function TituloPerfil({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="h1"
      sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 38, md: 48 }, color: cores.terracota, lineHeight: 1, overflowWrap: "anywhere" }}
    >
      {children}
    </Typography>
  );
}

export function PerfilNaoEncontrado({ texto }: { texto: string }) {
  return (
    <>
      <Header />
      <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden", backgroundColor: cores.fundo, px: 2, pt: { xs: 3, md: 6 }, pb: { xs: `${ALTURA_NAVEGACAO_INFERIOR + 24}px`, md: 6 } }}>
        <FundoPapel />
        <Paper
          elevation={0}
          sx={{ position: "relative", mx: "auto", maxWidth: 1200, backgroundColor: cores.papel, border: retro.borda, boxShadow: retro.sombra, borderRadius: 8, p: { xs: 2.5, md: 4 }, textAlign: "center", py: 8 }}
        >
          <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 28, color: cores.tinta }}>Perfil não encontrado</Typography>
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.textoSuave, mt: 1 }}>{texto}</Typography>
        </Paper>
      </Box>
    </>
  );
}
