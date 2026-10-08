import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { LinkRouter } from "../../../components/LinkRouter";
import { cores, fontes, retro } from "../../../lib/tema";
import type { AutorResumoCatalogo } from "../../../catalogo/catalogo.port";

export function CartaoAutor({ autor }: { autor: AutorResumoCatalogo }) {
  const datas = [autor.nascimento, autor.morte].filter(Boolean).join(" – ");

  return (
    <LinkRouter
      to="/autores/$autorId"
      params={{ autorId: autor.id }}
      underline="none"
      sx={{ display: "block", borderRadius: 4, "&:focus-visible": { outline: `3px solid ${cores.terracota}`, outlineOffset: 3 } }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          height: "100%",
          backgroundColor: cores.papel,
          border: retro.borda,
          boxShadow: retro.sombraLeve,
          borderRadius: 4,
          p: 2,
          transition: "transform 0.15s, box-shadow 0.15s",
          "&:hover": { transform: "translate(-2px, -2px)", boxShadow: retro.sombra },
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <Avatar
          variant="rounded"
          src={autor.fotoUrl ?? undefined}
          alt=""
          sx={{
            width: 64,
            height: 80,
            borderRadius: 3,
            border: `2px solid ${cores.tinta}`,
            backgroundColor: cores.azul,
            color: cores.tinta,
            fontFamily: fontes.titulo,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 30,
            flexShrink: 0,
          }}
        >
          {autor.nome.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 20, lineHeight: 1.15, color: cores.tinta }}>
            {autor.nome}
          </Typography>
          {datas && <Typography sx={{ fontFamily: fontes.corpo, fontSize: 13, color: cores.terracotaEscura, fontWeight: 500 }}>{datas}</Typography>}
          <Stack sx={{ mt: 0.5 }}>
            {autor.obraMaisConhecida && (
              <Typography noWrap sx={{ fontFamily: fontes.corpo, fontSize: 13, color: cores.textoSuave }}>
                Conhecido por “{autor.obraMaisConhecida}”
              </Typography>
            )}
            <Typography sx={{ fontFamily: fontes.corpo, fontSize: 13, color: cores.textoSuave }}>
              {autor.totalObras.toLocaleString("pt-BR")} {autor.totalObras === 1 ? "obra" : "obras"}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </LinkRouter>
  );
}
