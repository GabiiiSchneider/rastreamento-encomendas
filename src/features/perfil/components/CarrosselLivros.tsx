import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Box, Chip, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { cores, fontes, retro } from "../../../lib/tema";
import type { LivroNaEstante } from "../../livros/livros.types";
import { estiloDoLivro } from "../../livros/components/estilosCapa";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { IconeMais } from "../../../components/Icones";

type Props = {
  livros: LivroNaEstante[];
  publico?: boolean;
};

const LARGURA_CARTAO = 200;

export function CarrosselLivros({ livros, publico = false }: Props) {
  const navigate = useNavigate();
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
        <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {livros.length > 0 && (
            <>
              <IconButton aria-label="Voltar" onClick={() => rolar(-1)} sx={estiloSeta}>
                ‹
              </IconButton>
              <IconButton aria-label="Avançar" onClick={() => rolar(1)} sx={estiloSeta}>
                ›
              </IconButton>
              {!publico && (
                <Tooltip title="Ver todos">
                  <IconButton
                    aria-label="Ver todos os livros lidos"
                    onClick={() => navigate({ to: "/estante", search: { aba: "total-lidos" } })}
                    sx={{ ...estiloSeta, backgroundColor: cores.mostarda, color: cores.tinta, border: retro.borda, "&:hover": { backgroundColor: cores.mostardaEscura } }}
                  >
                    <IconeMais sx={{ fontSize: 22 }} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </Stack>
      </Stack>

      {livros.length === 0 ? (
        <EstanteVazia aoAdicionar={publico ? undefined : () => navigate({ to: "/livros/buscar" })} />
      ) : (
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
            const estilo = estiloDoLivro(livro.capaUrl, i);
            return (
              <Paper
                key={livro.id}
                elevation={0}
                sx={{
                  position: "relative",
                  overflow: "hidden",
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
                {livro.capaUrl && (
                  <>
                    <Box
                      component="img"
                      src={livro.capaUrl}
                      alt={`Capa de ${livro.titulo}`}
                      loading="lazy"
                      sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(to top, ${cores.tinta} 0%, ${cores.tinta} 25%, transparent 65%)`,
                      }}
                    />
                  </>
                )}

                <Box sx={{ position: "relative", minHeight: 24 }}>
                  {livro.genero && (
                    <Chip
                      label={livro.genero}
                      size="small"
                      sx={{
                        backgroundColor: estilo.chipFundo,
                        color: estilo.chipTexto,
                        fontFamily: fontes.corpo,
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ position: "relative" }}>
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
      )}
    </Box>
  );
}

function EstanteVazia({ aoAdicionar }: { aoAdicionar?: () => void }) {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: cores.fundo,
        border: `2px dashed ${cores.textoSuave}`,
        borderRadius: 4,
        px: 3,
        py: 5,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: cores.tinta }}>
        Nenhum livro lido por aqui ainda
      </Typography>
      <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave, mt: 1 }}>
        {aoAdicionar ? "Quando você terminar uma leitura, ela aparece nesta estante." : "Quando este leitor terminar uma leitura, ela aparece aqui."}
      </Typography>
      {aoAdicionar && (
        <BotaoRetro onClick={aoAdicionar} sx={{ mt: 3 }}>
          + Adicionar livro
        </BotaoRetro>
      )}
    </Paper>
  );
}
