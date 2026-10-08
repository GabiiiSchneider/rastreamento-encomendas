import { useState } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { Box, TextField, Button, Alert } from "@mui/material";
import { loginUsuario } from "../auth.functions";
import { botaoAutenticacao, campoEscuro } from "./estilosAutenticacao";

export function LoginForm() {
  const router = useRouter();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await loginUsuario({ data: { email, password } });
      await router.invalidate();
      await router.navigate({ href: redirect ?? "/home" });
    } catch (error) {
      setErro((error as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 380 }}>
      {erro && <Alert severity="error">{erro}</Alert>}

      <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={campoEscuro} />
      <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required sx={campoEscuro} />

      <Button
        type="submit"
        disabled={carregando}
        sx={botaoAutenticacao}
      >
        {carregando ? "Entrando..." : "Entrar"}
      </Button>
    </Box>
  );
}