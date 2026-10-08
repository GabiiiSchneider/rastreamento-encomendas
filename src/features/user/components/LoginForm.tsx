import { useState } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { Box, TextField, Button, Alert } from "@mui/material";
import { loginUsuario } from "../auth.functions";
import { cores, fontes } from "../../../lib/tema";

const campoEscuro = {
  "& .MuiOutlinedInput-root": {
    color: cores.papel,
    fontFamily: fontes.corpo,
    borderRadius: 3,
    backgroundColor: cores.tintaClara,
    "& fieldset": { borderColor: cores.bordaEscura },
    "&:hover fieldset": { borderColor: cores.rosa },
    "&.Mui-focused fieldset": { borderColor: cores.mostarda, borderWidth: 2 },
  },
  "& .MuiInputLabel-root": { color: cores.textoClaro, fontFamily: fontes.corpo },
  "& .MuiInputLabel-root.Mui-focused": { color: cores.mostarda },
};

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
        sx={{
          mt: 1,
          py: 1.4,
          borderRadius: 3,
          backgroundColor: cores.mostarda,
          color: cores.tinta,
          boxShadow: `4px 4px 0 ${cores.terracota}`,
          fontFamily: fontes.corpo,
          fontWeight: 700,
          fontSize: "1.1rem",
          textTransform: "none",
          transition: "transform 0.15s, box-shadow 0.15s",
          "&:hover": {
            backgroundColor: cores.mostardaEscura,
            transform: "translate(-1px, -1px)",
            boxShadow: `5px 5px 0 ${cores.terracota}`,
          },
          "&.Mui-disabled": { backgroundColor: cores.mostarda, color: cores.tinta, opacity: 0.6 },
        }}
      >
        {carregando ? "Entrando..." : "Entrar"}
      </Button>
    </Box>
  );
}