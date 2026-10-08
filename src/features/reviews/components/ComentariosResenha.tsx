import { useEffect, useState, type FormEvent } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { Box, IconButton, InputBase, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { AvatarUsuario } from "../../../components/AvatarUsuario";
import { IconeEnviar, IconeLixeira } from "../../../components/Icones";
import { cores, fontes, retro } from "../../../lib/tema";
import { dataCompleta, tempoRelativo } from "../../../lib/tempo";
import { comentarResenha, excluirComentario, listarComentarios } from "../reviews.functions";
import type { Comentario } from "../reviews.types";
import { LIMITES_RESENHA, validarComentario } from "../reviews.validacao";
import { NomeDoAutor } from "./NomeDoAutor";

type Props = {
  resenhaId: string;
  aoMudarTotal: (diferenca: number) => void;
};

type Estado = { tipo: "carregando" } | { tipo: "erro" } | { tipo: "pronto"; comentarios: Comentario[] };

export function ComentariosResenha({ resenhaId, aoMudarTotal }: Props) {
  const { usuario } = useRouteContext({ from: "__root__" });
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado({ tipo: "carregando" });
    listarComentarios({ data: { resenhaId } })
      .then((comentarios) => !cancelado && setEstado({ tipo: "pronto", comentarios }))
      .catch(() => !cancelado && setEstado({ tipo: "erro" }));
    return () => {
      cancelado = true;
    };
  }, [resenhaId, tentativa]);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const invalido = validarComentario(texto);
    if (invalido) {
      setErro(invalido);
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      const resultado = await comentarResenha({ data: { resenhaId, conteudo: texto } });
      if (!resultado.ok) {
        setErro(resultado.mensagem);
        return;
      }
      setTexto("");
      setEstado((atual) => (atual.tipo === "pronto" ? { ...atual, comentarios: [...atual.comentarios, resultado.valor] } : atual));
      aoMudarTotal(1);
    } catch {
      setErro("Não foi possível comentar agora. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  async function apagar(comentarioId: string) {
    try {
      const resultado = await excluirComentario({ data: { comentarioId } });
      if (!resultado.ok) {
        setErro(resultado.mensagem);
        return;
      }
      setEstado((atual) =>
        atual.tipo === "pronto" ? { ...atual, comentarios: atual.comentarios.filter((comentario) => comentario.id !== comentarioId) } : atual,
      );
      aoMudarTotal(-1);
    } catch {
      setErro("Não foi possível apagar o comentário agora.");
    }
  }

  return (
    <Box sx={{ borderTop: `2px dashed ${cores.textoClaro}`, mt: 2, pt: 2 }}>
      {estado.tipo === "carregando" && (
        <Stack sx={{ gap: 1.5, mb: 2 }} aria-busy="true" aria-label="Carregando comentários">
          <Skeleton variant="rounded" height={44} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rounded" height={44} sx={{ borderRadius: 3 }} />
        </Stack>
      )}

      {estado.tipo === "erro" && (
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave, mb: 2 }}>
          Não deu para carregar os comentários.{" "}
          <Box component="button" type="button" onClick={() => setTentativa((t) => t + 1)} sx={{ all: "unset", cursor: "pointer", fontWeight: 700, color: cores.terracotaEscura, textDecoration: "underline" }}>
            Tentar de novo
          </Box>
        </Typography>
      )}

      {estado.tipo === "pronto" && estado.comentarios.length === 0 && (
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave, mb: 2 }}>
          Ninguém comentou ainda. Que tal começar a conversa?
        </Typography>
      )}

      {estado.tipo === "pronto" && estado.comentarios.length > 0 && (
        <Stack component="ul" sx={{ listStyle: "none", m: 0, p: 0, gap: 1.5, mb: 2 }}>
          {estado.comentarios.map((comentario) => (
            <Stack component="li" key={comentario.id} direction="row" sx={{ gap: 1.25, alignItems: "flex-start" }}>
              <AvatarUsuario nome={comentario.autor.nome} avatarUrl={comentario.autor.avatarUrl} tamanho={32} />
              <Box sx={{ flex: 1, minWidth: 0, backgroundColor: cores.fundo, border: `1.5px solid ${cores.tinta}`, borderRadius: 3, px: 1.5, py: 1 }}>
                <Stack direction="row" sx={{ alignItems: "baseline", gap: 0.75, flexWrap: "wrap" }}>
                  <NomeDoAutor autor={comentario.autor} tamanho={14} />
                  <Typography
                    component="time"
                    dateTime={comentario.criadoEm}
                    title={dataCompleta(comentario.criadoEm)}
                    suppressHydrationWarning
                    sx={{ fontFamily: fontes.corpo, fontSize: 12, color: cores.textoSuave }}
                  >
                    · {tempoRelativo(comentario.criadoEm)}
                  </Typography>
                </Stack>
                <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.tinta, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                  {comentario.conteudo}
                </Typography>
              </Box>
              {comentario.meu && (
                <Tooltip title="Apagar comentário">
                  <IconButton aria-label="Apagar comentário" size="small" onClick={() => apagar(comentario.id)} sx={{ color: cores.textoSuave, "&:hover": { color: cores.terracotaEscura } }}>
                    <IconeLixeira sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          ))}
        </Stack>
      )}

      <Stack component="form" onSubmit={enviar} direction="row" sx={{ gap: 1, alignItems: "center" }}>
        {usuario && <AvatarUsuario nome={usuario.nome} avatarUrl={usuario.avatarUrl} tamanho={32} />}
        <InputBase
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            if (erro) setErro(null);
          }}
          placeholder="Escreva uma resposta..."
          multiline
          maxRows={4}
          inputProps={{ maxLength: LIMITES_RESENHA.comentarioMax, "aria-label": "Escreva uma resposta" }}
          sx={{
            flex: 1,
            px: 1.5,
            py: 0.75,
            fontFamily: fontes.corpo,
            fontSize: 14,
            color: cores.tinta,
            backgroundColor: cores.fundo,
            border: retro.borda,
            borderRadius: 3,
          }}
        />
        <Tooltip title="Responder">
          <span>
            <IconButton
              type="submit"
              aria-label="Enviar resposta"
              disabled={enviando || texto.trim().length === 0}
              sx={{ backgroundColor: cores.mostarda, color: cores.tinta, border: retro.borda, "&:hover": { backgroundColor: cores.mostardaEscura }, "&.Mui-disabled": { opacity: 0.5, border: retro.borda } }}
            >
              <IconeEnviar sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      {(erro || texto.length > LIMITES_RESENHA.comentarioMax - 50) && (
        <Typography role={erro ? "alert" : undefined} sx={{ fontFamily: fontes.corpo, fontSize: 12, color: erro ? cores.terracotaEscura : cores.textoSuave, mt: 0.75, textAlign: "right" }}>
          {erro ?? `${LIMITES_RESENHA.comentarioMax - texto.length} caracteres restantes`}
        </Typography>
      )}
    </Box>
  );
}
