import { useRef } from "react";
import { Box, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { cores, fontes, retro } from "../../../lib/tema";
import type { LivroLido } from "../perfil.mock";

type Props = {
  livros: LivroLido[];
};

const estilosCartao = [
  { fundo: cores.terracotaEscura, texto: cores.papel, chipFundo: cores.papel, chipTexto: cores.tinta },
  { fundo: cores.mostarda, texto: cores.tinta, chipFundo: cores.tinta, chipTexto: cores.papel },
  { fundo: cores.rosa, texto: cores.tinta, chipFundo: cores.papel, chipTexto: cores.tinta },
  { fundo: cores.azul, texto: cores.tinta, chipFundo: cores.tinta, chipTexto: cores.papel },
];

const LARGURA_CARTAO = 200;

export function CarrosselLivros({ livros }: Props) {
  const trilhoRef = useRef<HTMLDivElement>(null);

  function rolar(direcao: 1 | -1) {
    trilhoRef.current?.scrollBy({ left: direcao * (LARGURA_CARTAO + 16) * 2, behavior: "smooth" });
  }

  const estiloSeta = {
    width: 40,
    height: 40,
    backgroundColor: cores.tinta,
    color: cores.papel,
    fontFamily: fontes.corpo,
    fontSize: 26,
    lineHeight: 1,
    "&:hover": { backgroundColor: cores.terracotaEscura },
  };

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 28, color: cores.tinta, lineHeight: 1.1 }}>
            Livros lidos
          </Typography>
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>
            As últimas histórias que passaram pela estante
          </Typography>
        </Box>
        <Stack direction="row" sx={{ gap: 1 }}>
          <IconButton aria-label="Voltar" onClick={() => rolar(-1)} sx={estiloSeta}>
            ‹
          </IconButton>
          <IconButton aria-label="Avançar" onClick={() => rolar(1)} sx={estiloSeta}>
            ›
          </IconButton>
        </Stack>
      </Stack>

      <Box
        ref={trilhoRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
          pr: 1,
          pb: 1.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {livros.map((livro, i) => {
          const estilo = estilosCartao[i % estilosCartao.length];
          return (
            <Paper
              key={livro.id}
              elevation={0}
              sx={{
                flex: `0 0 ${LARGURA_CARTAO}px`,
                minHeight: 220,
                scrollSnapAlign: "start",
                backgroundColor: estilo.fundo,
                color: estilo.texto,
                border: retro.borda,
                boxShadow: retro.sombraLeve,
                borderRadius: 4,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Chip
                label={livro.genero}
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  backgroundColor: estilo.chipFundo,
                  color: estilo.chipTexto,
                  fontFamily: fontes.corpo,
                  fontWeight: 700,
                }}
              />
              <Box>
                <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 22, lineHeight: 1.15, color: estilo.texto }}>
                  {livro.titulo}
                </Typography>
                <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, mt: 0.5, color: estilo.texto }}>
                  {livro.autor}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
