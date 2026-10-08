import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Box, Fab, Stack, Tooltip } from "@mui/material";
import { Header } from "../../../components/Header";
import { FundoPapel } from "../../../components/FundoPapel";
import { IconeLapis } from "../../../components/Icones";
import { cores, retro } from "../../../lib/tema";
import { QuemSeguir } from "../../social/components/QuemSeguir";
import { BarraPesquisa } from "./BarraPesquisa";
import { LivrosEmAlta } from "./LivrosEmAlta";
import { MenuLateral } from "./MenuLateral";
import { ALTURA_NAVEGACAO_INFERIOR } from "./NavegacaoInferior";

export const ANCORA_ESCREVER = "escrever";

type Props = {
  children: ReactNode;
  aoEscrever?: () => void;
  pesquisaInicial?: string;
  mostrarPesquisa?: boolean;
  mostrarQuemSeguir?: boolean;
};

const lateralFixa = { position: "sticky", top: 96, alignSelf: "start" } as const;

export function LayoutFeed({ children, aoEscrever, pesquisaInicial, mostrarPesquisa = true, mostrarQuemSeguir = true }: Props) {
  const navigate = useNavigate();
  const escrever = aoEscrever ?? (() => navigate({ to: "/home", hash: ANCORA_ESCREVER }));

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "clip",
          backgroundColor: cores.fundo,
          px: 2,
          pt: { xs: 2, md: 4 },
          pb: { xs: `${ALTURA_NAVEGACAO_INFERIOR + 88}px`, md: 6 },
        }}
      >
        <FundoPapel />

        <Box
          sx={{
            position: "relative",
            mx: "auto",
            maxWidth: 1240,
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "220px minmax(0, 1fr)", lg: "240px minmax(0, 1fr) 320px" },
            gap: { xs: 2, md: 3 },
            alignItems: "start",
          }}
        >
          <Box component="aside" sx={{ display: { xs: "none", md: "block" }, ...lateralFixa }}>
            <MenuLateral aoEscrever={escrever} />
          </Box>

          <Stack component="main" sx={{ gap: 2.5, minWidth: 0 }}>
            {mostrarPesquisa && (
              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <BarraPesquisa valorInicial={pesquisaInicial} />
              </Box>
            )}
            {children}
          </Stack>

          <Stack component="aside" aria-label="Descobrir" sx={{ display: { xs: "none", lg: "flex" }, gap: 2.5, ...lateralFixa }}>
            {mostrarPesquisa && <BarraPesquisa valorInicial={pesquisaInicial} />}
            <LivrosEmAlta />
            {mostrarQuemSeguir && <QuemSeguir />}
          </Stack>
        </Box>
      </Box>

      <Tooltip title="Escrever resenha">
        <Fab
          onClick={escrever}
          aria-label="Escrever resenha"
          sx={{
            display: { xs: "flex", md: "none" },
            position: "fixed",
            right: 16,
            bottom: `calc(${ALTURA_NAVEGACAO_INFERIOR + 16}px + env(safe-area-inset-bottom))`,
            backgroundColor: cores.mostarda,
            color: cores.tinta,
            border: retro.borda,
            boxShadow: `4px 4px 0 ${cores.terracota}`,
            "&:hover": { backgroundColor: cores.mostardaEscura },
          }}
        >
          <IconeLapis />
        </Fab>
      </Tooltip>
    </>
  );
}
