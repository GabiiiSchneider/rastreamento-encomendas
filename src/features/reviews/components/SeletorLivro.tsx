import { useEffect, useState } from "react";
import { Autocomplete, Box, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { estiloCampoRetro } from "../../../components/estiloCampo";
import { cores, fontes, retro } from "../../../lib/tema";
import type { LivroCatalogo } from "../../../catalogo/catalogo.port";
import { buscarLivros } from "../../livros/livros.functions";
import { estiloDoLivro, indiceDoId } from "../../livros/components/estilosCapa";

type Props = {
  valor: LivroCatalogo | null;
  aoMudar: (livro: LivroCatalogo | null) => void;
  erro?: string | null;
  id?: string;
};

const ESPERA_DIGITACAO_MS = 400;
const MINIMO_CARACTERES = 2;

export function SeletorLivro({ valor, aoMudar, erro, id }: Props) {
  const [texto, setTexto] = useState("");
  const [opcoes, setOpcoes] = useState<LivroCatalogo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    const termo = texto.trim();
    if (termo.length < MINIMO_CARACTERES || (valor && termo === valor.titulo)) {
      setCarregando(false);
      return;
    }

    let cancelado = false;
    setCarregando(true);
    const espera = setTimeout(() => {
      buscarLivros({ data: { termo, pagina: 1 } })
        .then((resultado) => {
          if (cancelado) return;
          setOpcoes(resultado.livros);
          setFalhou(false);
        })
        .catch(() => !cancelado && setFalhou(true))
        .finally(() => !cancelado && setCarregando(false));
    }, ESPERA_DIGITACAO_MS);

    return () => {
      cancelado = true;
      clearTimeout(espera);
    };
  }, [texto, valor]);

  const textoAjuda = erro ?? (falhou ? "A busca falhou. Continue digitando para tentar de novo." : "Digite o título ou o autor.");

  return (
    <Autocomplete
      id={id}
      value={valor}
      onChange={(_, livro) => aoMudar(livro)}
      inputValue={texto}
      onInputChange={(_, novo) => setTexto(novo)}
      options={valor && !opcoes.some((opcao) => opcao.externalId === valor.externalId) ? [valor, ...opcoes] : opcoes}
      filterOptions={(itens) => itens}
      getOptionLabel={(livro) => livro.titulo}
      isOptionEqualToValue={(a, b) => a.externalId === b.externalId}
      loading={carregando}
      loadingText="Procurando livros..."
      noOptionsText={texto.trim().length < MINIMO_CARACTERES ? "Comece a digitar para ver sugestões" : "Nenhum livro encontrado"}
      renderOption={({ key, ...props }, livro) => (
        <Box component="li" key={key} {...props} sx={{ gap: 1.5, alignItems: "center" }}>
          <CapaMini livro={livro} />
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontFamily: fontes.corpo, fontWeight: 700, fontSize: 15, color: cores.tinta }}>
              {livro.titulo}
            </Typography>
            <Typography noWrap sx={{ fontFamily: fontes.corpo, fontSize: 13, color: cores.textoSuave }}>
              {livro.autor}
              {livro.ano ? ` · ${livro.ano}` : ""}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Qual livro?"
          error={Boolean(erro)}
          helperText={textoAjuda}
          sx={estiloCampoRetro}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  {carregando && <CircularProgress size={18} sx={{ color: cores.terracota, mr: 1 }} />}
                  {params.slotProps.input.endAdornment}
                </Stack>
              ),
            },
          }}
        />
      )}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            backgroundColor: cores.papel,
            border: retro.borda,
            boxShadow: retro.sombraLeve,
            borderRadius: 3,
            "& .MuiAutocomplete-loading, & .MuiAutocomplete-noOptions": { fontFamily: fontes.corpo, color: cores.textoSuave },
          },
        },
      }}
    />
  );
}

function CapaMini({ livro }: { livro: LivroCatalogo }) {
  const estilo = estiloDoLivro(livro.capaUrl, indiceDoId(livro.externalId));
  return (
    <Box
      component={livro.capaUrl ? "img" : "span"}
      src={livro.capaUrl ?? undefined}
      alt=""
      loading="lazy"
      sx={{
        width: 32,
        height: 48,
        flexShrink: 0,
        display: "block",
        objectFit: "cover",
        borderRadius: 1,
        border: `1.5px solid ${cores.tinta}`,
        backgroundColor: estilo.fundo,
      }}
    />
  );
}
