import { createFileRoute } from "@tanstack/react-router";
import { Box, Paper } from "@mui/material";
import { cores } from "../lib/tema";
import { FundoY2K } from "../components/FundoY2K";
import { PainelIlustrado } from "../components/PainelIlustrado";
import { LoginBoasVindas } from "../features/livros/components/LoginBoasVindas";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
        backgroundColor: cores.fundo,
      }}
    >
      <FundoY2K />

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 1100,
          minHeight: 600,
          backgroundColor: cores.preto,
          borderRadius: 8,
          p: { xs: 3, md: 4 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        <LoginBoasVindas />
        <PainelIlustrado src="/ilustracoes/new-beginnings.png" alt="Ilustração de boas-vindas" />
      </Paper>
    </Box>
  );
}