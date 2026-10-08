import { useState, type FormEvent } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { Box, FormControlLabel, Paper, Rating, Stack, Switch, TextField, Typography } from "@mui/material";
import { AvatarUsuario } from "../../../components/AvatarUsuario";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { estiloCampoRetro } from "../../../components/estiloCampo";
import { cores, fontes, retro } from "../../../lib/tema";
import type { LivroCatalogo } from "../../../catalogo/catalogo.port";
import { publicarResenha } from "../reviews.functions";
import type { Resenha } from "../reviews.types";
import { LIMITES_RESENHA, validarConteudoResenha } from "../reviews.validacao";
import { SeletorLivro } from "./SeletorLivro";

export const ID_CAIXA_RESENHA = "nova-resenha";
export const ID_CAMPO_LIVRO = "nova-resenha-livro";

type Props = {
  aoPublicar: (resenha: Resenha) => void;
};

export const estiloEstrelas = {
  color: cores.mostardaEscura,
  "& .MuiRating-iconEmpty": { color: cores.textoClaro },
  "& .MuiRating-iconHover": { color: cores.terracota },
};

export function focarCaixaResenha() {
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(ID_CAIXA_RESENHA)?.scrollIntoView({ behavior: reduzirMovimento ? "auto" : "smooth", block: "center" });
  document.getElementById(ID_CAMPO_LIVRO)?.focus({ preventScroll: true });
}

export function CaixaNovaResenha({ aoPublicar }: Props) {
  const { usuario } = useRouteContext({ from: "__root__" });
  const [livro, setLivro] = useState<LivroCatalogo | null>(null);
  const [conteudo, setConteudo] = useState("");
  const [nota, setNota] = useState<number | null>(null);
  const [temSpoiler, setTemSpoiler] = useState(false);
  const [erroLivro, setErroLivro] = useState<string | null>(null);
  const [erroTexto, setErroTexto] = useState<string | null>(null);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [publicando, setPublicando] = useState(false);

  const restantes = LIMITES_RESENHA.conteudoMax - conteudo.length;

  async function publicar(evento: FormEvent) {
    evento.preventDefault();
    const semLivro = livro ? null : "Escolha o livro da resenha.";
    const textoInvalido = validarConteudoResenha(conteudo);
    setErroLivro(semLivro);
    setErroTexto(textoInvalido);
    setErroGeral(null);
    if (!livro || semLivro || textoInvalido) return;

    setPublicando(true);
    try {
      const resultado = await publicarResenha({ data: { externalId: livro.externalId, conteudo, nota, temSpoiler } });
      if (!resultado.ok) {
        setErroGeral(resultado.mensagem);
        return;
      }
      setLivro(null);
      setConteudo("");
      setNota(null);
      setTemSpoiler(false);
      aoPublicar(resultado.valor);
    } catch (erro) {
      const detalhe = erro instanceof Error && erro.message ? ` (${erro.message})` : "";
      setErroGeral(`Não foi possível publicar${detalhe}. Tente novamente.`);
    } finally {
      setPublicando(false);
    }
  }

  return (
    <Paper
      id={ID_CAIXA_RESENHA}
      component="form"
      onSubmit={publicar}
      noValidate
      elevation={0}
      aria-labelledby={`${ID_CAIXA_RESENHA}-titulo`}
      sx={{ backgroundColor: cores.papel, border: retro.borda, boxShadow: retro.sombra, borderRadius: 6, p: { xs: 2, md: 3 }, scrollMarginTop: 96 }}
    >
      <Stack direction="row" sx={{ gap: 1.5, alignItems: "center", mb: 2 }}>
        {usuario && <AvatarUsuario nome={usuario.nome} avatarUrl={usuario.avatarUrl} />}
        <Typography
          id={`${ID_CAIXA_RESENHA}-titulo`}
          component="h2"
          sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 22, md: 26 }, color: cores.tinta, lineHeight: 1.1 }}
        >
          O que você está lendo?
        </Typography>
      </Stack>

      <Stack sx={{ gap: 2 }}>
        <SeletorLivro
          id={ID_CAMPO_LIVRO}
          valor={livro}
          aoMudar={(novo) => {
            setLivro(novo);
            if (novo) setErroLivro(null);
          }}
          erro={erroLivro}
        />

        <TextField
          label="Sua resenha"
          placeholder="Conte o que achou da leitura..."
          value={conteudo}
          onChange={(e) => {
            setConteudo(e.target.value);
            if (erroTexto) setErroTexto(null);
          }}
          error={Boolean(erroTexto)}
          helperText={erroTexto ?? `${restantes} ${restantes === 1 ? "caractere restante" : "caracteres restantes"}`}
          multiline
          minRows={3}
          fullWidth
          slotProps={{ htmlInput: { maxLength: LIMITES_RESENHA.conteudoMax } }}
          sx={estiloCampoRetro}
        />

        <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: { xs: 1, sm: 3 }, alignItems: { xs: "flex-start", sm: "center" } }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <Typography component="span" id="nova-resenha-nota" sx={{ fontFamily: fontes.corpo, fontWeight: 700, fontSize: 14, color: cores.textoSuave }}>
              Nota (opcional)
            </Typography>
            <Rating
              name="nota"
              value={nota}
              onChange={(_, valor) => setNota(valor)}
              aria-labelledby="nova-resenha-nota"
              sx={estiloEstrelas}
            />
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={temSpoiler}
                onChange={(e) => setTemSpoiler(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: cores.terracota },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: cores.terracota, opacity: 0.6 },
                }}
              />
            }
            label="Contém spoiler"
            sx={{ m: 0, "& .MuiFormControlLabel-label": { fontFamily: fontes.corpo, fontWeight: 700, fontSize: 14, color: cores.tinta } }}
          />
        </Stack>

        {erroGeral && (
          <Typography role="alert" sx={{ fontFamily: fontes.corpo, fontSize: 14, fontWeight: 500, color: cores.terracotaEscura }}>
            {erroGeral}
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <BotaoRetro type="submit" disabled={publicando} sx={{ width: { xs: "100%", sm: "auto" } }}>
            {publicando ? "Publicando..." : "Publicar resenha"}
          </BotaoRetro>
        </Box>
      </Stack>
    </Paper>
  );
}
