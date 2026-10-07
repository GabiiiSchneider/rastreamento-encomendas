import { useState } from "react";
import { Avatar, Box, Link, Stack, Typography } from "@mui/material";
import { cores, fontes, retro } from "../../../lib/tema";
import type { AutorCatalogo } from "../../../catalogo/catalogo.port";

const MAXIMO_PARAGRAFOS = 2;
const MAXIMO_CARACTERES = 600;

function paragrafosDe(texto: string) {
  return texto
    .split(/\n+/)
    .map((paragrafo) => paragrafo.trim())
    .filter(Boolean);
}

// os primeiros parágrafos, cortando no fim de uma frase quando o texto for muito longo
function resumir(paragrafos: string[]) {
  const resumo: string[] = [];
  let total = 0;
  for (const paragrafo of paragrafos.slice(0, MAXIMO_PARAGRAFOS)) {
    if (total + paragrafo.length <= MAXIMO_CARACTERES) {
      resumo.push(paragrafo);
      total += paragrafo.length;
      continue;
    }
    const restante = paragrafo.slice(0, Math.max(0, MAXIMO_CARACTERES - total));
    const fimDaFrase = restante.lastIndexOf(". ");
    const cortado = fimDaFrase > 80 ? restante.slice(0, fimDaFrase + 1) : `${restante.replace(/\s+\S*$/, "")}…`;
    if (resumo.length === 0 || cortado.length > 80) resumo.push(cortado);
    break;
  }
  return resumo;
}

export function FotoAutor({ autor, tamanho }: { autor: AutorCatalogo; tamanho: { xs: number; md: number } }) {
  return (
    <Avatar
      variant="rounded"
      src={autor.fotoUrl ?? undefined}
      alt={autor.fotoUrl ? `Foto de ${autor.nome}` : undefined}
      sx={{
        width: tamanho,
        height: { xs: tamanho.xs * 1.25, md: tamanho.md * 1.25 },
        borderRadius: 4,
        border: retro.borda,
        boxShadow: retro.sombraLeve,
        backgroundColor: cores.azul,
        color: cores.tinta,
        fontFamily: fontes.titulo,
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: { xs: tamanho.xs * 0.45, md: tamanho.md * 0.45 },
        flexShrink: 0,
        "& img": { objectFit: "cover" },
      }}
    >
      {autor.nome.charAt(0).toUpperCase()}
    </Avatar>
  );
}

export function textoDasDatas(autor: AutorCatalogo) {
  if (autor.nascimento && autor.morte) return `${autor.nascimento} – ${autor.morte}`;
  if (autor.nascimento) return `Nasceu em ${autor.nascimento}`;
  if (autor.morte) return `Morreu em ${autor.morte}`;
  return null;
}

export function DatasAutor({ autor }: { autor: AutorCatalogo }) {
  const datas = textoDasDatas(autor);
  if (!datas) return null;
  return <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, fontWeight: 500, color: cores.terracotaEscura }}>{datas}</Typography>;
}

type BiografiaProps = {
  texto: string | null;
  // na página do autor a biografia aparece inteira
  completa?: boolean;
};

export function BiografiaAutor({ texto, completa = false }: BiografiaProps) {
  const [expandida, setExpandida] = useState(false);

  if (!texto) {
    return (
      <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, lineHeight: 1.7, color: cores.textoSuave }}>
        A Open Library ainda não tem uma biografia deste autor.
      </Typography>
    );
  }

  const paragrafos = paragrafosDe(texto);
  const resumo = resumir(paragrafos);
  const cortada = resumo.join("\n") !== paragrafos.join("\n");
  const visiveis = completa || expandida || !cortada ? paragrafos : resumo;

  return (
    <Box>
      <Stack sx={{ gap: 1.5 }}>
        {visiveis.map((paragrafo, i) => (
          <Typography key={i} sx={{ fontFamily: fontes.corpo, fontSize: 16, lineHeight: 1.7, color: cores.tinta }}>
            {paragrafo}
          </Typography>
        ))}
      </Stack>
      {!completa && cortada && (
        <Link
          component="button"
          type="button"
          onClick={() => setExpandida((atual) => !atual)}
          aria-expanded={expandida}
          underline="hover"
          sx={{ mt: 1, fontFamily: fontes.corpo, fontWeight: 700, fontSize: 15, color: cores.terracotaEscura }}
        >
          {expandida ? "Ler menos" : "Ler mais"}
        </Link>
      )}
    </Box>
  );
}
