import { Box, Chip, Paper, Skeleton, Typography } from "@mui/material";
import { LinkRouter } from "../../../components/LinkRouter";
import { cores, fontes, retro } from "../../../lib/tema";
import type { LivroCatalogo } from "../../../catalogo/catalogo.port";
import { paraLivroId } from "../livros.ids";
import { estiloDoLivro, indiceDoId } from "./estilosCapa";

type Props = {
  livro: LivroCatalogo;
  busca: { q?: string; pagina?: number };
};

const ALTURA_CARTAO = 280;

export function CartaoLivroBusca({ livro, busca }: Props) {
  const estilo = estiloDoLivro(livro.capaUrl, indiceDoId(livro.externalId));

  return (
    <LinkRouter
      to="/livros/$livroId"
      params={{ livroId: paraLivroId(livro.externalId) }}
      search={busca}
      underline="none"
      aria-label={`${livro.titulo}, de ${livro.autor}`}
      sx={{
        display: "block",
        borderRadius: 4,
        "&:focus-visible": { outline: `3px solid ${cores.terracota}`, outlineOffset: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          height: ALTURA_CARTAO,
          backgroundColor: estilo.fundo,
          color: estilo.texto,
          border: retro.borda,
          boxShadow: retro.sombraLeve,
          borderRadius: 4,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
          transition: "transform 0.15s, box-shadow 0.15s",
          "&:hover": { transform: "translate(-2px, -2px)", boxShadow: retro.sombra },
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        {livro.capaUrl && (
          <>
            <Box
              component="img"
              src={livro.capaUrl}
              alt=""
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
          {livro.ano && (
            <Chip
              label={livro.ano}
              size="small"
              sx={{ backgroundColor: estilo.chipFundo, color: estilo.chipTexto, fontFamily: fontes.corpo, fontWeight: 700 }}
            />
          )}
        </Box>
        <Box sx={{ position: "relative" }}>
          <Typography
            sx={{
              fontFamily: fontes.titulo,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: 1.15,
              color: estilo.texto,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {livro.titulo}
          </Typography>
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, mt: 0.5, color: estilo.texto }} noWrap>
            {livro.autor}
          </Typography>
        </Box>
      </Paper>
    </LinkRouter>
  );
}

export function CartaoLivroCarregando() {
  return (
    <Skeleton
      variant="rounded"
      height={ALTURA_CARTAO}
      sx={{ borderRadius: 4, backgroundColor: cores.fundo, border: `2px solid ${cores.textoClaro}` }}
    />
  );
}
