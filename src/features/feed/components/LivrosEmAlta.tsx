import { useEffect, useState } from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { PainelLateral } from "../../../components/PainelLateral";
import { LinkRouter } from "../../../components/LinkRouter";
import { cores, fontes } from "../../../lib/tema";
import type { LivroCatalogo } from "../../../catalogo/catalogo.port";
import { listarLivrosEmAlta } from "../../livros/livros.functions";
import { paraLivroId } from "../../livros/livros.ids";
import { estiloDoLivro, indiceDoId } from "../../livros/components/estilosCapa";

type Estado = { tipo: "carregando" } | { tipo: "erro" } | { tipo: "pronto"; livros: LivroCatalogo[] };

export function LivrosEmAlta() {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  useEffect(() => {
    let cancelado = false;
    listarLivrosEmAlta()
      .then((livros) => !cancelado && setEstado({ tipo: "pronto", livros }))
      .catch(() => !cancelado && setEstado({ tipo: "erro" }));
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <PainelLateral titulo="Livros em alta">
      {estado.tipo === "carregando" && (
        <Stack sx={{ gap: 1.5 }} aria-busy="true" aria-label="Carregando livros em alta">
          {Array.from({ length: 4 }, (_, i) => (
            <Stack key={i} direction="row" sx={{ gap: 1.5 }}>
              <Skeleton variant="rounded" width={40} height={60} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
      {estado.tipo === "erro" && (
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>
          A Open Library não respondeu agora. Tente recarregar daqui a pouco.
        </Typography>
      )}
      {estado.tipo === "pronto" && (
        <Stack component="ol" sx={{ listStyle: "none", m: 0, p: 0, gap: 1.25 }}>
          {estado.livros.map((livro, i) => {
            const estilo = estiloDoLivro(livro.capaUrl, indiceDoId(livro.externalId));
            return (
              <li key={livro.externalId}>
                <LinkRouter
                  to="/livros/$livroId"
                  params={{ livroId: paraLivroId(livro.externalId) }}
                  underline="none"
                  sx={{ display: "flex", gap: 1.5, alignItems: "center", borderRadius: 2, p: 0.5, m: -0.5, "&:hover": { backgroundColor: cores.fundo } }}
                >
                  <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 700, fontSize: 20, color: cores.terracota, width: 18, flexShrink: 0 }}>
                    {i + 1}
                  </Typography>
                  <Box
                    component={livro.capaUrl ? "img" : "span"}
                    src={livro.capaUrl ?? undefined}
                    alt=""
                    loading="lazy"
                    sx={{ width: 40, height: 60, flexShrink: 0, display: "block", objectFit: "cover", borderRadius: 1, border: `1.5px solid ${cores.tinta}`, backgroundColor: estilo.fundo }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontFamily: fontes.corpo, fontWeight: 700, fontSize: 14, lineHeight: 1.25, color: cores.tinta, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {livro.titulo}
                    </Typography>
                    <Typography noWrap sx={{ fontFamily: fontes.corpo, fontSize: 13, color: cores.textoSuave }}>
                      {livro.autor}
                    </Typography>
                  </Box>
                </LinkRouter>
              </li>
            );
          })}
        </Stack>
      )}
    </PainelLateral>
  );
}
