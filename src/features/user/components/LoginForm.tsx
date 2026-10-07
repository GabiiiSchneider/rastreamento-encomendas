import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Box, TextField, Button, Alert } from "@mui/material";
import { loginUsuario } from "../auth.functions";
import { cores, fontes } from "../../../lib/tema";

const campoEscuro = {
  "& .MuiOutlinedInput-root": {
    color: cores.branco,
    fontFamily: fontes.corpo,
    borderRadius: 4,
    backgroundColor: cores.campo,
    "& fieldset": { borderColor: cores.borda },
    "&:hover fieldset": { borderColor: cores.rosa },
    "&.Mui-focused fieldset": { borderColor: cores.rosa, borderWidth: 2 },
  },
  "& .MuiInputLabel-root": { color: cores.cinza, fontFamily: fontes.corpo },
  "& .MuiInputLabel-root.Mui-focused": { color: cores.rosa },
};

export function LoginForm() {
  const navigate = useNavigate();
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
      navigate({ to: "/home" });
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
        sx={{
          mt: 1,
          py: 1.4,
          borderRadius: 50,
          backgroundColor: cores.limao,
          color: cores.preto,
          fontFamily: fontes.corpo,
          fontWeight: 700,
          fontSize: "1.1rem",
          textTransform: "none",
          "&:hover": { backgroundColor: cores.limaoEscuro },
          "&.Mui-disabled": { backgroundColor: cores.limao, color: cores.preto, opacity: 0.6 },
        }}
      >
        {carregando ? "Entrando..." : "Entrar"}
      </Button>
    </Box>
  );
}