import { Box, Typography } from "@mui/material";
import { cores, fontes } from "../../../lib/tema";
import { MensagemEstado } from "../../livros/components/MensagemEstado";
import { listarResenhasDoLeitor } from "../reviews.functions";
import type { Resenha } from "../reviews.types";
import { useListaCursor } from "../useListaCursor";
import { ListaResenhas } from "./ListaResenhas";

export const ID_SECAO_RESENHAS = "resenhas";

type Props = {
  username: string;
  titulo: string;
  vazio: { titulo: string; texto: string };
};

export function rolarAteResenhas() {
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(ID_SECAO_RESENHAS)?.scrollIntoView({ behavior: reduzirMovimento ? "auto" : "smooth", block: "start" });
}

export function ResenhasDoLeitor({ username, titulo, vazio }: Props) {
  const lista = useListaCursor<Resenha>(username, async (cursor) => {
    const pagina = await listarResenhasDoLeitor({ data: { username, cursor } });
    return { itens: pagina.resenhas, proximoCursor: pagina.proximoCursor };
  });

  return (
    <Box component="section" id={ID_SECAO_RESENHAS} aria-labelledby={`${ID_SECAO_RESENHAS}-titulo`} sx={{ scrollMarginTop: 96 }}>
      <Typography
        id={`${ID_SECAO_RESENHAS}-titulo`}
        component="h2"
        sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 28, color: cores.tinta, lineHeight: 1.1, mb: 2 }}
      >
        {titulo}
      </Typography>
      <ListaResenhas lista={lista} vazio={<MensagemEstado titulo={vazio.titulo} texto={vazio.texto} />} />
    </Box>
  );
}
