import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Box, ButtonBase, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { cores, fontes, retro } from "../../../lib/tema";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { LinkRouter } from "../../../components/LinkRouter";
import type { Aviso } from "../../../components/AvisoRetro";
import type { AbaEstante } from "../../livros/livros.estante";
import { DialogConexoes } from "../../social/components/DialogConexoes";
import type { TipoConexao } from "../../social/social.types";
import type { PerfilUsuario } from "../perfil.types";
import { AvatarEditavel, FotoPerfil } from "./AvatarEditavel";

type Props = {
  perfil: PerfilUsuario;
  editavel?: boolean;
  aoAtualizar?: () => void;
  aoAvisar?: (aviso: Aviso) => void;
  acao?: ReactNode;
  aoVerResenhas?: () => void;
};

const estiloNumero = {
  backgroundColor: cores.papel,
  border: retro.borda,
  boxShadow: retro.sombraLeve,
  borderRadius: 4,
  p: 1.5,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 1,
} as const;

const estiloNumeroClicavel = {
  ...estiloNumero,
  transition: "transform 0.15s, box-shadow 0.15s, background-color 0.15s",
  "&:hover": { transform: "translate(-2px, -2px)", boxShadow: `5px 5px 0 ${cores.tinta}`, backgroundColor: cores.fundo },
  "&:focus-visible": { outline: `3px solid ${cores.terracota}`, outlineOffset: 3 },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
};

export function CartaoUsuario({ perfil, editavel = true, aoAtualizar, aoAvisar, acao, aoVerResenhas }: Props) {
  const navigate = useNavigate();
  const [conexoes, setConexoes] = useState<TipoConexao | null>(null);
  const { estatisticas, social, meta } = perfil;
  const porcentagem = meta && meta.objetivo > 0 ? Math.min(100, Math.round((meta.lidos / meta.objetivo) * 100)) : 0;

  const numeros: Array<{ label: string; valor: number; fundo: string; texto: string; aba: AbaEstante }> = [
    { label: "lidos no mês", valor: estatisticas.lidosNoMes, fundo: cores.rosa, texto: cores.tinta, aba: "lidos-no-mes" },
    { label: "total lidos", valor: estatisticas.totalLidos, fundo: cores.mostarda, texto: cores.tinta, aba: "total-lidos" },
    { label: "quero ler", valor: estatisticas.queroLer, fundo: cores.azul, texto: cores.tinta, aba: "quero-ler" },
    { label: "lendo agora", valor: estatisticas.lendo, fundo: cores.terracotaEscura, texto: cores.papel, aba: "lendo" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: cores.fundo,
        border: retro.borda,
        borderRadius: 6,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Stack sx={{ alignItems: "center", gap: 1, textAlign: "center" }}>
        {editavel && aoAtualizar && aoAvisar ? (
          <AvatarEditavel nome={perfil.nome} avatarUrl={perfil.avatarUrl} aoSalvar={aoAtualizar} aoAvisar={aoAvisar} />
        ) : (
          <FotoPerfil nome={perfil.nome} src={perfil.avatarUrl} />
        )}
        <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 28, lineHeight: 1.1, color: cores.tinta }}>
          {perfil.nome}
        </Typography>
        {perfil.usuario && (
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.terracotaEscura, fontWeight: 500 }}>
            @{perfil.usuario}
          </Typography>
        )}

        <Stack direction="row" sx={{ gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Conexao valor={social.seguidores} rotulo={social.seguidores === 1 ? "seguidor" : "seguidores"} aoClicar={perfil.usuario ? () => setConexoes("seguidores") : undefined} />
          <Conexao valor={social.seguindo} rotulo="seguindo" aoClicar={perfil.usuario ? () => setConexoes("seguindo") : undefined} />
        </Stack>

        {acao && <Box sx={{ mt: 1 }}>{acao}</Box>}
      </Stack>

      <Stack sx={{ gap: 1.5 }}>
        {editavel && (
          <BotaoRetro onClick={() => navigate({ to: "/livros/buscar" })} sx={{ width: "100%" }}>
            + Adicionar livro
          </BotaoRetro>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          {numeros.map((item) =>
            editavel ? (
              <LinkRouter
                key={item.label}
                to="/estante"
                search={{ aba: item.aba }}
                underline="none"
                aria-label={`${item.valor} ${item.label}: ver na estante`}
                sx={estiloNumeroClicavel}
              >
                <Numero {...item} />
              </LinkRouter>
            ) : (
              <Box key={item.label} sx={estiloNumero}>
                <Numero {...item} />
              </Box>
            ),
          )}

          <ButtonBase
            onClick={aoVerResenhas}
            disabled={!aoVerResenhas}
            aria-label={`${social.resenhas} ${social.resenhas === 1 ? "resenha" : "resenhas"}: ver resenhas`}
            sx={{ ...estiloNumeroClicavel, gridColumn: "1 / -1", flexDirection: "row", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}
          >
            <Chip
              label="resenhas"
              size="small"
              sx={{ backgroundColor: cores.tinta, color: cores.papel, fontFamily: fontes.corpo, fontWeight: 700, fontSize: 11, height: 22, cursor: "inherit" }}
            />
            <Typography sx={{ fontFamily: fontes.titulo, fontSize: 32, fontWeight: 700, lineHeight: 1, color: cores.tinta }}>
              {social.resenhas}
            </Typography>
          </ButtonBase>
        </Box>
      </Stack>

      <Paper elevation={0} sx={{ backgroundColor: cores.papel, border: retro.borda, borderRadius: 4, p: 2 }}>
        <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: cores.terracotaEscura }}>
          {meta ? `Meta de ${meta.ano}` : "Meta do ano"}
        </Typography>
        {meta ? (
          <>
            <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave, mb: 1.5 }}>
              {meta.lidos} de {meta.objetivo} livros lidos
            </Typography>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={porcentagem}
                sx={{
                  flexGrow: 1,
                  height: 12,
                  borderRadius: 50,
                  backgroundColor: cores.fundo,
                  border: `1px solid ${cores.tinta}`,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 50,
                    backgroundColor: cores.terracota,
                  },
                }}
              />
              <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, fontWeight: 700, color: cores.terracotaEscura }}>
                {porcentagem}%
              </Typography>
            </Stack>
          </>
        ) : (
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>
            Nenhuma meta de leitura definida para este ano.
          </Typography>
        )}
      </Paper>

      {perfil.usuario && <DialogConexoes username={perfil.usuario} tipo={conexoes} aoFechar={() => setConexoes(null)} />}
    </Paper>
  );
}

function Numero({ label, valor, fundo, texto }: { label: string; valor: number; fundo: string; texto: string }) {
  return (
    <>
      <Chip
        label={label}
        size="small"
        sx={{ backgroundColor: fundo, color: texto, fontFamily: fontes.corpo, fontWeight: 700, fontSize: 11, height: 22, cursor: "inherit" }}
      />
      <Typography sx={{ fontFamily: fontes.titulo, fontSize: 32, fontWeight: 700, lineHeight: 1, color: cores.tinta }}>{valor}</Typography>
    </>
  );
}

function Conexao({ valor, rotulo, aoClicar }: { valor: number; rotulo: string; aoClicar?: () => void }) {
  const conteudo = (
    <>
      <Box component="span" sx={{ fontWeight: 700, color: cores.tinta }}>
        {valor.toLocaleString("pt-BR")}
      </Box>{" "}
      {rotulo}
    </>
  );
  const estilo = { fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave, borderRadius: 1 };

  if (!aoClicar) return <Typography sx={estilo}>{conteudo}</Typography>;
  return (
    <ButtonBase onClick={aoClicar} sx={{ ...estilo, "&:hover": { textDecoration: "underline" }, "&:focus-visible": { outline: `3px solid ${cores.terracota}`, outlineOffset: 2 } }}>
      {conteudo}
    </ButtonBase>
  );
}
