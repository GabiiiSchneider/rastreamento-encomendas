import { createFileRoute } from "@tanstack/react-router";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { Header } from "../components/Header";
import { FundoPapel } from "../components/FundoPapel";
import { fontes, cores, retro } from "../lib/tema";
import { perfilMock } from "../features/perfil/perfil.mock";
import { CartaoUsuario } from "../features/perfil/components/CartaoUsuario";
import { CarrosselLivros } from "../features/perfil/components/CarrosselLivros";
import { SobreUsuario } from "../features/perfil/components/SobreUsuario";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  const perfil = perfilMock;

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
          py: { xs: 3, md: 6 },
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
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 320px" },
            gap: 4,
          }}
        >
          <Stack sx={{ gap: 4, order: { xs: 2, md: 1 }, minWidth: 0 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: fontes.titulo,
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: { xs: 38, md: 48 },
                  color: cores.terracota,
                  lineHeight: 1,
                }}
              >
                Perfil
              </Typography>
              <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.textoSuave, mt: 1 }}>
                Suas leituras, metas e um pouquinho sobre você.
              </Typography>
            </Box>

            <CarrosselLivros livros={perfil.livrosLidos} />
            <SobreUsuario bio={perfil.bio} generoFavorito={perfil.generoFavorito} />
          </Stack>

          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <CartaoUsuario perfil={perfil} />
          </Box>
        </Paper>
      </Box>
    </>
  );
}
