import { Typography } from "@mui/material";
import { LinkRouter } from "../../../components/LinkRouter";
import { cores, fontes } from "../../../lib/tema";
import type { AutorPublicacao } from "../reviews.types";

type Props = {
  autor: AutorPublicacao;
  tamanho?: number;
  mostrarUsername?: boolean;
};

export function NomeDoAutor({ autor, tamanho = 15, mostrarUsername = false }: Props) {
  const estiloNome = { fontFamily: fontes.corpo, fontWeight: 700, fontSize: tamanho, color: cores.tinta };

  if (!autor.username) {
    return <Typography component="span" sx={estiloNome}>{autor.nome}</Typography>;
  }

  return (
    <>
      <LinkRouter to="/u/$username" params={{ username: autor.username }} underline="hover" sx={estiloNome}>
        {autor.nome}
      </LinkRouter>
      {mostrarUsername && (
        <LinkRouter
          to="/u/$username"
          params={{ username: autor.username }}
          underline="hover"
          sx={{ fontFamily: fontes.corpo, fontSize: tamanho - 1, color: cores.textoSuave }}
        >
          @{autor.username}
        </LinkRouter>
      )}
    </>
  );
}
