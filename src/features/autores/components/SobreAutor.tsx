import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { cores, fontes, retro } from "../../../lib/tema";
import type { AutorCatalogo, LivroCatalogo } from "../../../catalogo/catalogo.port";
import { CartaoLivroBusca, CartaoLivroCarregando } from "../../livros/components/CartaoLivroBusca";
import { obterAutor, listarLivrosDoAutor } from "../autores.functions";
import { BiografiaAutor, DatasAutor, FotoAutor } from "./InfoAutor";

export const ID_SECAO_AUTOR = "sobre-o-autor";

type Props = {
  autorId: string;
  // o livro da página atual não precisa aparecer na fileira
  externalIdAtual: string;
};

type Estado =
  | { tipo: "carregando" }
  | { tipo: "erro" }
  | { tipo: "pronto"; autor: AutorCatalogo | null; livros: LivroCatalogo[]; total: number };

const LIVROS_NA_FILEIRA = 8;
const LARGURA_CARTAO = 170;

export function SobreAutor({ autorId, externalIdAtual }: Props) {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado({ tipo: "carregando" });
    Promise.all([
      obterAutor({ data: { autorId } }),
      listarLivrosDoAutor({ data: { autorId, pagina: 1, limite: LIVROS_NA_FILEIRA + 1 } }),
    ])
      .then(([autor, resultado]) => {
        if (cancelado) return;
        const livros = resultado.livros.filter((livro) => livro.externalId !== externalIdAtual).slice(0, LIVROS_NA_FILEIRA);
        setEstado({ tipo: "pronto", autor, livros, total: resultado.total });
      })
      .catch(() => {
        if (!cancelado) setEstado({ tipo: "erro" });
      });
    return () => {
      cancelado = true;
    };
  }, [autorId, externalIdAtual, tentativa]);

  return (
    <Paper
      component="section"
      id={ID_SECAO_AUTOR}
      aria-labelledby={`${ID_SECAO_AUTOR}-titulo`}
      elevation={0}
      sx={{
        // o Header é sticky; a margem evita que ele cubra o título ao rolar até aqui
        scrollMarginTop: 96,
        backgroundColor: cores.fundo,
        border: retro.borda,
        borderRadius: 5,
        p: { xs: 2.5, md: 3.5 },
        minWidth: 0,
      }}
    >
      <Typography
        id={`${ID_SECAO_AUTOR}-titulo`}
        component="h2"
        sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 28, md: 32 }, color: cores.tinta, lineHeight: 1.1, mb: 2.5 }}
      >
        Sobre o autor
      </Typography>

      {estado.tipo === "carregando" && <AutorCarregando />}

      {estado.tipo === "erro" && (
        <Box>
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave }}>
            Não conseguimos carregar as informações do autor agora.
          </Typography>
          <BotaoRetro variante="secundario" onClick={() => setTentativa((t) => t + 1)} sx={{ mt: 2 }}>
            Tentar de novo
          </BotaoRetro>
        </Box>
      )}

      {estado.tipo === "pronto" && !estado.autor && (
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave }}>
          A Open Library ainda não tem informações sobre este autor.
        </Typography>
      )}

      {estado.tipo === "pronto" && estado.autor && (
        <Stack sx={{ gap: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: { xs: 2, sm: 3 }, alignItems: "flex-start" }}>
            <FotoAutor autor={estado.autor} tamanho={{ xs: 110, md: 140 }} />
            <Stack sx={{ gap: 1.5, minWidth: 0 }}>
              <Box>
                <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 26, color: cores.tinta, lineHeight: 1.1 }}>
                  {estado.autor.nome}
                </Typography>
                <DatasAutor autor={estado.autor} />
              </Box>
              <BiografiaAutor texto={estado.autor.biografia} />
            </Stack>
          </Stack>

          {estado.livros.length > 0 && (
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: cores.tinta, mb: 1.5 }}>
                Outros livros de {estado.autor.nome}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  // espaço para a sombra e o efeito de hover dos cartões não serem cortados
                  p: 0.5,
                  pt: 1,
                  pb: 1.5,
                  "& > *": { flex: `0 0 ${LARGURA_CARTAO}px`, scrollSnapAlign: "start" },
                }}
              >
                {estado.livros.map((livro) => (
                  <CartaoLivroBusca key={livro.externalId} livro={livro} busca={{ de: "autor", autor: autorId }} />
                ))}
              </Box>
            </Box>
          )}

          <BotaoRetro
            onClick={() => navigate({ to: "/autores/$autorId", params: { autorId } })}
            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
          >
            Ver todos os livros{estado.total > 0 ? ` (${estado.total.toLocaleString("pt-BR")})` : ""}
          </BotaoRetro>
        </Stack>
      )}
    </Paper>
  );
}

function AutorCarregando() {
  return (
    <Stack sx={{ gap: 3 }} aria-busy="true" aria-label="Carregando informações do autor">
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 3 }}>
        <Skeleton variant="rounded" width={140} height={175} sx={{ borderRadius: 4, flexShrink: 0 }} />
        <Stack sx={{ gap: 1, flex: 1 }}>
          <Skeleton variant="text" width="50%" height={36} />
          <Skeleton variant="text" width="35%" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Stack>
      </Stack>
      <Box sx={{ display: "flex", gap: 2, overflow: "hidden" }}>
        {Array.from({ length: 4 }, (_, i) => (
          <Box key={i} sx={{ flex: `0 0 ${LARGURA_CARTAO}px` }}>
            <CartaoLivroCarregando />
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
