import { createFileRoute } from "@tanstack/react-router";
import { Box, Paper } from "@mui/material";
import { cores } from "../lib/tema";
import { FundoPapel } from "../components/FundoPapel";
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
      <FundoPapel />

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 1100,
          minHeight: 600,
          backgroundColor: cores.tinta,
          borderRadius: 8,
          boxShadow: `8px 8px 0 ${cores.terracota}`,
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
