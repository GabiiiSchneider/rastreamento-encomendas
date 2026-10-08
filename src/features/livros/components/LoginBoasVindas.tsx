import { Box, Stack, Typography, Chip } from "@mui/material";
import { useSearch } from "@tanstack/react-router";
import { LinkRouter } from "../../../components/LinkRouter";
import { linkTrocarTela, textoTrocarTela } from "../../user/components/estilosAutenticacao";
import { cores, fontes } from "../../../lib/tema";
import { LoginForm } from "../../user/components/LoginForm";

const destaques = ["Resenhas", "Leituras", "Leitores"];

export function LoginBoasVindas() {
  const { redirect } = useSearch({ from: "/login" });

  return (
    <Stack sx={{ color: cores.papel, pl: { md: 2 } }}>
      <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontSize: 22, color: cores.rosa }}>
        estante ❦
      </Typography>

      <Stack spacing={3} sx={{ my: "auto", py: 4 }}>
        <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 40, md: 54 }, lineHeight: 1.05 }}>
          Olá!
          <br />
          Bem-vinda à{" "}
          <Box component="span" sx={{ color: cores.mostarda }}>Estante.</Box>
        </Typography>

        <Typography sx={{ color: cores.textoClaro, maxWidth: 380, lineHeight: 1.7, fontFamily: fontes.corpo }}>
          Guarde os livros que você já leu, escreva suas resenhas e veja o que outros leitores andam lendo. Entre na sua conta para começar.
        </Typography>

        <LoginForm />

        <Typography sx={textoTrocarTela}>
          Ainda não tem conta?{" "}
          <LinkRouter to="/cadastro" search={{ redirect }} underline="hover" sx={linkTrocarTela}>
            Cadastre-se
          </LinkRouter>
        </Typography>

        <Stack direction="row" spacing={1}>
          {destaques.map((item) => (
            <Chip
              key={item}
              label={item}
              variant="outlined"
              sx={{ color: cores.rosa, borderColor: cores.rosa, borderWidth: 2, fontFamily: fontes.corpo, fontWeight: 500 }}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
