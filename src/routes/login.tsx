import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@mui/material";
import { LoginForm } from "../features/usuario/components/LoginForm";

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
      }}
    >
      <LoginForm />
    </Box>
  );
}
