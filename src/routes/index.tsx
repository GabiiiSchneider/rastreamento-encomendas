import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Button, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { cores, fontes } from "../lib/tema";
import { EstanteAnimada } from "../components/EstanteAnimada";

export const Route = createFileRoute("/")({
  component: InicioPage,
});

const surgir = keyframes`
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

function animacaoSurgir(atraso: number) {
  return {
    animation: `${surgir} 0.8s ease-out ${atraso}s both`,
    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
  };
}

function InicioPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: cores.tinta,
        color: cores.papel,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 5 },
          py: { xs: 2, md: 3 },
          ...animacaoSurgir(0),
        }}
      >
        <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 22, md: 26 }, color: cores.rosa }}>
          estante ❦
        </Typography>
        <Stack direction="row" sx={{ gap: { xs: 1, sm: 1.5 }, alignItems: "center" }}>
          <Button
            onClick={() => navigate({ to: "/cadastro" })}
            sx={{
              px: { xs: 2, md: 3 },
              py: 1,
              borderRadius: 3,
              border: `2px solid ${cores.rosa}`,
              color: cores.rosa,
              fontFamily: fontes.corpo,
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: cores.rosa, color: cores.tinta },
            }}
          >
            Criar conta
          </Button>
          <Button
            onClick={() => navigate({ to: "/login" })}
            sx={{
              px: { xs: 3, md: 4 },
              py: 1,
              borderRadius: 3,
              backgroundColor: cores.mostarda,
              color: cores.tinta,
              boxShadow: `4px 4px 0 ${cores.terracota}`,
              fontFamily: fontes.corpo,
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              transition: "transform 0.15s, box-shadow 0.15s",
              "&:hover": {
                backgroundColor: cores.mostardaEscura,
                transform: "translate(-2px, -2px)",
                boxShadow: `6px 6px 0 ${cores.terracota}`,
              },
            }}
          >
            Entrar
          </Button>
        </Stack>
      </Stack>

      <Stack
        sx={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 4, md: 5 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Stack sx={{ alignItems: "center", textAlign: "center", px: 2, gap: 2, ...animacaoSurgir(0) }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: fontes.titulo,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: { xs: 44, sm: 64, md: 88 },
              lineHeight: 1,
              color: cores.papel,
            }}
          >
            A sua estante,
            <br />
            <Box component="span" sx={{ color: cores.mostarda }}>compartilhada.</Box>
          </Typography>
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: { xs: 16, md: 18 }, color: cores.textoClaro, maxWidth: 520, lineHeight: 1.6 }}>
            Registre o que você lê, escreva resenhas e descubra seu próximo livro na estante de outros leitores.
          </Typography>
        </Stack>

        <EstanteAnimada />
      </Stack>
    </Box>
  );
}
