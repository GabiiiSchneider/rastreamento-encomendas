import { Box, Stack, Typography } from "@mui/material";
import { useSearch } from "@tanstack/react-router";
import { LinkRouter } from "../../../components/LinkRouter";
import { cores, fontes } from "../../../lib/tema";
import { CadastroForm } from "./CadastroForm";
import { linkTrocarTela, textoTrocarTela } from "./estilosAutenticacao";

export function CadastroBoasVindas() {
  const { redirect } = useSearch({ from: "/cadastro" });

  return (
    <Stack sx={{ color: cores.papel, pl: { md: 2 } }}>
      <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontSize: 22, color: cores.rosa }}>
        estante ❦
      </Typography>

      <Stack spacing={3} sx={{ my: "auto", py: 4 }}>
        <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 40, md: 54 }, lineHeight: 1.05 }}>
          Crie sua{" "}
          <Box component="span" sx={{ color: cores.mostarda }}>estante.</Box>
        </Typography>

        <Typography sx={{ color: cores.textoClaro, maxWidth: 380, lineHeight: 1.7, fontFamily: fontes.corpo }}>
          Leva menos de um minuto. Depois é só guardar suas leituras, escrever resenhas e seguir os amigos.
        </Typography>

        <CadastroForm />

        <Typography sx={textoTrocarTela}>
          Já tem conta?{" "}
          <LinkRouter to="/login" search={{ redirect }} underline="hover" sx={linkTrocarTela}>
            Entrar
          </LinkRouter>
        </Typography>
      </Stack>
    </Stack>
  );
}
