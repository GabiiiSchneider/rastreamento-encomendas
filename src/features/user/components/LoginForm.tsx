import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Próximo passo: chamar a server function de login aqui
    console.log({ email, password });
  }

  return (
    <Card sx={{ width: "100%", maxWidth: 400 }}>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Entrar
          </Typography>

          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <Button type="submit" variant="contained" fullWidth>
            Entrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
