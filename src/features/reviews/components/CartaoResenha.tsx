import { useState } from "react";
import { Box, Button, Paper, Rating, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { AvatarUsuario } from "../../../components/AvatarUsuario";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { DialogRetro } from "../../../components/DialogRetro";
import { LinkRouter } from "../../../components/LinkRouter";
import { IconeComentario, IconeCoracao, IconeCoracaoVazio, IconeLixeira, IconeOlho } from "../../../components/Icones";
import { cores, fontes, retro } from "../../../lib/tema";
import { dataCompleta, tempoRelativo } from "../../../lib/tempo";
import { paraLivroId } from "../../livros/livros.ids";
import { estiloDoLivro, indiceDoId } from "../../livros/components/estilosCapa";
import { alternarCurtida, excluirResenha } from "../reviews.functions";
import type { Resenha } from "../reviews.types";
import { estiloEstrelas } from "./CaixaNovaResenha";
import { ComentariosResenha } from "./ComentariosResenha";
import { NomeDoAutor } from "./NomeDoAutor";

type Props = {
  resenha: Resenha;
  aoExcluir?: (id: string) => void;
};

const estiloAcao = {
  minWidth: 0,
  px: 1.25,
  py: 0.5,
  gap: 0.75,
  borderRadius: 3,
  color: cores.textoSuave,
  fontFamily: fontes.corpo,
  fontWeight: 700,
  fontSize: 14,
  textTransform: "none",
  "&:hover": { backgroundColor: cores.fundo, color: cores.tinta },
} as const;

export function CartaoResenha({ resenha, aoExcluir }: Props) {
  const [curtida, setCurtida] = useState(resenha.curtidaPorMim);
  const [curtidas, setCurtidas] = useState(resenha.curtidas);
  const [comentarios, setComentarios] = useState(resenha.comentarios);
  const [comentariosAbertos, setComentariosAbertos] = useState(false);
  const [spoilerVisivel, setSpoilerVisivel] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const escondido = resenha.temSpoiler && !spoilerVisivel;
  const livroId = paraLivroId(resenha.livro.externalId);

  async function curtir() {
    const antes = { curtida, curtidas };
    setCurtida(!curtida);
    setCurtidas(curtidas + (curtida ? -1 : 1));
    setErro(null);
    try {
      const resultado = await alternarCurtida({ data: { resenhaId: resenha.id } });
      if (!resultado.ok) throw new Error(resultado.mensagem);
      setCurtida(resultado.valor.curtida);
      setCurtidas(resultado.valor.curtidas);
    } catch (e) {
      setCurtida(antes.curtida);
      setCurtidas(antes.curtidas);
      setErro(e instanceof Error && e.message ? e.message : "Não foi possível curtir agora.");
    }
  }

  async function excluir() {
    setExcluindo(true);
    try {
      const resultado = await excluirResenha({ data: { resenhaId: resenha.id } });
      if (!resultado.ok) throw new Error(resultado.mensagem);
      setConfirmandoExclusao(false);
      aoExcluir?.(resenha.id);
    } catch (e) {
      setErro(e instanceof Error && e.message ? e.message : "Não foi possível excluir agora.");
      setConfirmandoExclusao(false);
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <Paper
      component="article"
      elevation={0}
      aria-label={`Resenha de ${resenha.autor.nome} sobre ${resenha.livro.titulo}`}
      sx={{ backgroundColor: cores.papel, border: retro.borda, boxShadow: retro.sombraLeve, borderRadius: 5, p: { xs: 2, md: 2.5 } }}
    >
      <Stack direction="row" sx={{ gap: 1.5 }}>
        {resenha.autor.username ? (
          <LinkRouter to="/u/$username" params={{ username: resenha.autor.username }} aria-label={`Perfil de ${resenha.autor.nome}`} sx={{ borderRadius: "50%", alignSelf: "flex-start" }}>
            <AvatarUsuario nome={resenha.autor.nome} avatarUrl={resenha.autor.avatarUrl} />
          </LinkRouter>
        ) : (
          <AvatarUsuario nome={resenha.autor.nome} avatarUrl={resenha.autor.avatarUrl} />
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" sx={{ alignItems: "baseline", columnGap: 0.75, flexWrap: "wrap" }}>
            <NomeDoAutor autor={resenha.autor} mostrarUsername />
            <Typography
              component="time"
              dateTime={resenha.criadaEm}
              title={dataCompleta(resenha.criadaEm)}
              suppressHydrationWarning
              sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}
            >
              · {tempoRelativo(resenha.criadaEm)}
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ gap: 1.5, mt: 1.5, alignItems: "center" }}>
            <LinkRouter to="/livros/$livroId" params={{ livroId }} aria-label={`Abrir ${resenha.livro.titulo}`} sx={{ flexShrink: 0, borderRadius: 1 }}>
              <CapaPequena resenha={resenha} />
            </LinkRouter>
            <Box sx={{ minWidth: 0 }}>
              <LinkRouter
                to="/livros/$livroId"
                params={{ livroId }}
                underline="hover"
                sx={{ display: "block", fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 19, lineHeight: 1.15, color: cores.tinta }}
              >
                {resenha.livro.titulo}
              </LinkRouter>
              <LinkRouter
                to="/buscar"
                search={{ q: resenha.livro.autor, tipo: "autores" }}
                underline="hover"
                sx={{ fontFamily: fontes.corpo, fontSize: 14, fontWeight: 500, color: cores.terracotaEscura }}
              >
                {resenha.livro.autor}
              </LinkRouter>
              {resenha.nota !== null && (
                <Rating value={resenha.nota} readOnly size="small" aria-label={`Nota ${resenha.nota} de 5`} sx={{ ...estiloEstrelas, display: "flex", mt: 0.25 }} />
              )}
            </Box>
          </Stack>

          <Box sx={{ position: "relative", mt: 1.5 }}>
            <Typography
              aria-hidden={escondido}
              sx={{
                fontFamily: fontes.corpo,
                fontSize: 16,
                lineHeight: 1.6,
                color: cores.tinta,
                whiteSpace: "pre-line",
                overflowWrap: "anywhere",
                filter: escondido ? "blur(7px)" : "none",
                userSelect: escondido ? "none" : "auto",
                transition: "filter 0.2s",
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            >
              {resenha.conteudo}
            </Typography>
            {escondido && (
              <Stack sx={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
                <BotaoRetro variante="secundario" onClick={() => setSpoilerVisivel(true)} startIcon={<IconeOlho />} sx={{ px: 2, py: 0.75, fontSize: 14 }}>
                  Mostrar spoiler
                </BotaoRetro>
              </Stack>
            )}
          </Box>

          <Stack direction="row" sx={{ mt: 1.5, ml: -1.25, gap: 0.5, alignItems: "center" }}>
            <Tooltip title={curtida ? "Descurtir" : "Curtir"}>
              <Button
                onClick={curtir}
                aria-pressed={curtida}
                aria-label={`${curtida ? "Descurtir" : "Curtir"} (${curtidas} ${curtidas === 1 ? "curtida" : "curtidas"})`}
                sx={{ ...estiloAcao, color: curtida ? cores.terracota : estiloAcao.color, "&:hover": { ...estiloAcao["&:hover"], color: cores.terracota } }}
              >
                {curtida ? <IconeCoracao sx={{ fontSize: 20 }} /> : <IconeCoracaoVazio sx={{ fontSize: 20 }} />}
                {curtidas}
              </Button>
            </Tooltip>
            <Tooltip title={comentariosAbertos ? "Esconder comentários" : "Comentar"}>
              <Button
                onClick={() => setComentariosAbertos((aberto) => !aberto)}
                aria-expanded={comentariosAbertos}
                aria-label={`Comentários (${comentarios})`}
                sx={{ ...estiloAcao, color: comentariosAbertos ? cores.tinta : estiloAcao.color }}
              >
                <IconeComentario sx={{ fontSize: 19 }} />
                {comentarios}
              </Button>
            </Tooltip>
            {resenha.minha && (
              <Tooltip title="Excluir resenha">
                <Button
                  onClick={() => setConfirmandoExclusao(true)}
                  aria-label="Excluir resenha"
                  sx={{ ...estiloAcao, ml: "auto", "&:hover": { ...estiloAcao["&:hover"], color: cores.terracotaEscura } }}
                >
                  <IconeLixeira sx={{ fontSize: 20 }} />
                </Button>
              </Tooltip>
            )}
          </Stack>

          {erro && (
            <Typography role="alert" sx={{ fontFamily: fontes.corpo, fontSize: 13, color: cores.terracotaEscura, mt: 0.5 }}>
              {erro}
            </Typography>
          )}

          {comentariosAbertos && (
            <ComentariosResenha resenhaId={resenha.id} aoMudarTotal={(diferenca) => setComentarios((total) => Math.max(0, total + diferenca))} />
          )}
        </Box>
      </Stack>

      <DialogRetro
        aberto={confirmandoExclusao}
        aoFechar={() => !excluindo && setConfirmandoExclusao(false)}
        titulo="Excluir resenha?"
        acoes={
          <>
            <BotaoRetro variante="secundario" onClick={() => setConfirmandoExclusao(false)} disabled={excluindo}>
              Cancelar
            </BotaoRetro>
            <BotaoRetro onClick={excluir} disabled={excluindo} sx={{ backgroundColor: cores.terracota, color: cores.papel, boxShadow: retro.sombraLeve, "&:hover": { backgroundColor: cores.terracotaEscura } }}>
              {excluindo ? "Excluindo..." : "Excluir"}
            </BotaoRetro>
          </>
        }
      >
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.tinta }}>
          A resenha sobre “{resenha.livro.titulo}”, as curtidas e os comentários dela serão apagados. Não dá para desfazer.
        </Typography>
      </DialogRetro>
    </Paper>
  );
}

function CapaPequena({ resenha }: { resenha: Resenha }) {
  const tamanho = { width: 52, height: 78, display: "block", borderRadius: 1, border: `1.5px solid ${cores.tinta}` };
  if (resenha.livro.capaUrl) {
    return <Box component="img" src={resenha.livro.capaUrl} alt="" loading="lazy" sx={{ ...tamanho, objectFit: "cover", backgroundColor: cores.fundo }} />;
  }
  const estilo = estiloDoLivro(null, indiceDoId(resenha.livro.externalId));
  return (
    <Box sx={{ ...tamanho, backgroundColor: estilo.fundo, color: estilo.texto, p: 0.5, overflow: "hidden" }}>
      <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 9, lineHeight: 1.1, color: estilo.texto }}>
        {resenha.livro.titulo}
      </Typography>
    </Box>
  );
}

export function CartaoResenhaCarregando() {
  return (
    <Paper elevation={0} sx={{ backgroundColor: cores.papel, border: `2px solid ${cores.textoClaro}`, borderRadius: 5, p: 2.5 }}>
      <Stack direction="row" sx={{ gap: 1.5 }}>
        <Skeleton variant="circular" width={44} height={44} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="45%" />
          <Stack direction="row" sx={{ gap: 1.5, mt: 1 }}>
            <Skeleton variant="rounded" width={52} height={78} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="35%" />
            </Box>
          </Stack>
          <Skeleton variant="text" sx={{ mt: 1 }} />
          <Skeleton variant="text" width="80%" />
        </Box>
      </Stack>
    </Paper>
  );
}
