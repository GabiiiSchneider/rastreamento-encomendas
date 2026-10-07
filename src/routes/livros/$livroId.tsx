import { useState } from "react";
import { createFileRoute, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { Box, Chip, Link, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { PaginaComCard } from "../../components/PaginaComCard";
import { BotaoRetro } from "../../components/BotaoRetro";
import { LinkRouter } from "../../components/LinkRouter";
import { AvisoRetro, type Aviso } from "../../components/AvisoRetro";
import { cores, fontes, retro } from "../../lib/tema";
import type { ReadingStatus } from "../../generated/prisma/enums";
import type { DetalhesLivroCatalogo } from "../../catalogo/catalogo.port";
import { adicionarNaEstante, obterLivro, obterStatusNaEstante } from "../../features/livros/livros.functions";
import { validarBuscaLivro, type BuscaLivro } from "../../features/livros/livros.busca";
import { paraExternalId } from "../../features/livros/livros.ids";
import { OPCOES_STATUS, rotuloDoStatus } from "../../features/livros/livros.status";
import { estiloDoLivro, indiceDoId } from "../../features/livros/components/estilosCapa";
import { MensagemEstado } from "../../features/livros/components/MensagemEstado";
import { ID_SECAO_AUTOR, SobreAutor } from "../../features/autores/components/SobreAutor";

export const Route = createFileRoute("/livros/$livroId")({
  validateSearch: validarBuscaLivro,
  loader: async ({ params }) => {
    const [livro, statusAtual] = await Promise.all([
      obterLivro({ data: { livroId: params.livroId } }),
      obterStatusNaEstante({ data: { externalId: paraExternalId(params.livroId) } }),
    ]);
    if (!livro) throw notFound();
    return { livro, statusAtual };
  },
  component: LivroPage,
  pendingComponent: LivroCarregando,
  errorComponent: LivroErro,
  notFoundComponent: LivroNaoEncontrado,
});

const ESPERA_ANTES_DE_SAIR_MS = 1200;

function LivroPage() {
  const { livro, statusAtual } = Route.useLoaderData();
  return <DetalhesLivro key={livro.externalId} livro={livro} statusAtual={statusAtual} />;
}

function DetalhesLivro({ livro, statusAtual }: { livro: DetalhesLivroCatalogo; statusAtual: ReadingStatus | null }) {
  const busca = Route.useSearch();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ReadingStatus | null>(statusAtual);
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  function irParaAutor() {
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(ID_SECAO_AUTOR)?.scrollIntoView({ behavior: reduzirMovimento ? "auto" : "smooth", block: "start" });
  }

  async function salvar(destino: "busca" | "perfil") {
    if (!status) return;
    setSalvando(true);
    try {
      await adicionarNaEstante({ data: { externalId: livro.externalId, status } });
      setAviso({ tipo: "success", mensagem: `“${livro.titulo}” foi salvo na sua estante como ${rotuloDoStatus(status)}.` });
      setTimeout(() => {
        if (destino === "busca") navigate({ to: "/livros/buscar", search: { q: busca.q, pagina: busca.pagina } });
        else navigate({ to: "/perfil" });
      }, ESPERA_ANTES_DE_SAIR_MS);
    } catch (erro) {
      const detalhe = erro instanceof Error && erro.message ? ` (${erro.message})` : "";
      setAviso({ tipo: "error", mensagem: `Não foi possível salvar o livro${detalhe}. Tente novamente.` });
      setSalvando(false);
    }
  }

  return (
    <PaginaComCard>
      <Stack sx={{ gap: 3 }}>
        <VoltarParaBusca busca={busca} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "300px minmax(0, 1fr)" },
            gap: { xs: 3, md: 5 },
            alignItems: "start",
          }}
        >
          <CapaGrande livro={livro} />

          <Stack sx={{ gap: 3, minWidth: 0 }}>
            <Box>
              {livro.genero && (
                <Chip
                  label={livro.genero}
                  size="small"
                  sx={{ backgroundColor: cores.mostarda, color: cores.tinta, border: `1.5px solid ${cores.tinta}`, fontFamily: fontes.corpo, fontWeight: 700, mb: 1.5 }}
                />
              )}
              <Typography
                component="h1"
                sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 34, md: 46 }, color: cores.tinta, lineHeight: 1.05 }}
              >
                {livro.titulo}
              </Typography>
              <Typography sx={{ fontFamily: fontes.corpo, fontSize: 18, fontWeight: 500, color: cores.terracotaEscura, mt: 1 }}>
                {livro.autorId ? (
                  <Link
                    component="button"
                    type="button"
                    onClick={irParaAutor}
                    underline="hover"
                    aria-label={`${livro.autor}: ver mais sobre o autor`}
                    sx={{ font: "inherit", color: "inherit", verticalAlign: "baseline", textAlign: "left" }}
                  >
                    {livro.autor}
                  </Link>
                ) : (
                  livro.autor
                )}
                {livro.ano && (
                  <Box component="span" sx={{ color: cores.textoSuave, fontWeight: 400 }}>
                    {" "}· {livro.ano}
                  </Box>
                )}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: fontes.corpo,
                fontSize: 16,
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                color: livro.descricao ? cores.tinta : cores.textoSuave,
              }}
            >
              {livro.descricao ?? "Este livro ainda não tem descrição na Open Library."}
            </Typography>

            {livro.assuntos.length > 0 && (
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                {livro.assuntos.map((assunto) => (
                  <Chip
                    key={assunto}
                    label={assunto}
                    size="small"
                    sx={{ backgroundColor: cores.fundo, color: cores.tinta, border: `1.5px solid ${cores.tinta}`, fontFamily: fontes.corpo, fontWeight: 500 }}
                  />
                ))}
              </Stack>
            )}

            <Paper elevation={0} sx={{ backgroundColor: cores.fundo, border: retro.borda, borderRadius: 5, p: { xs: 2.5, md: 3 } }}>
              <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 26, color: cores.tinta, lineHeight: 1.1 }}>
                Na sua estante
              </Typography>
              <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave, mt: 0.5, mb: 2 }}>
                {statusAtual
                  ? `Este livro já está na sua estante como “${rotuloDoStatus(statusAtual)}”. Escolha outro status para alterar.`
                  : "Como está a sua leitura deste livro?"}
              </Typography>

              <ToggleButtonGroup
                value={status}
                exclusive
                onChange={(_, novo: ReadingStatus | null) => novo && setStatus(novo)}
                aria-label="Status de leitura"
                sx={{
                  flexWrap: "wrap",
                  gap: 1,
                  "& .MuiToggleButtonGroup-grouped, & .MuiToggleButtonGroup-firstButton, & .MuiToggleButtonGroup-middleButton, & .MuiToggleButtonGroup-lastButton": {
                    m: 0,
                    px: 2.5,
                    py: 0.75,
                    border: retro.borda,
                    borderRadius: 3,
                    backgroundColor: cores.papel,
                    color: cores.tinta,
                    fontFamily: fontes.corpo,
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: "none",
                    "&:hover": { backgroundColor: cores.papel, boxShadow: retro.sombraLeve },
                    "&.Mui-selected, &.Mui-selected:hover": {
                      backgroundColor: cores.mostarda,
                      color: cores.tinta,
                      boxShadow: retro.sombraLeve,
                    },
                  },
                }}
              >
                {OPCOES_STATUS.map((opcao) => (
                  <ToggleButton key={opcao.valor} value={opcao.valor}>
                    {opcao.rotulo}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 2, mt: 3 }}>
                <BotaoRetro variante="secundario" onClick={() => salvar("busca")} disabled={!status || salvando}>
                  Salvar e adicionar mais
                </BotaoRetro>
                <BotaoRetro onClick={() => salvar("perfil")} disabled={!status || salvando}>
                  Salvar e ver meu perfil
                </BotaoRetro>
              </Stack>
              {!status && (
                <Typography sx={{ fontFamily: fontes.corpo, fontSize: 13, color: cores.textoSuave, mt: 1.5 }}>
                  Escolha um status para salvar.
                </Typography>
              )}
            </Paper>
          </Stack>
        </Box>

        {livro.autorId && <SobreAutor autorId={livro.autorId} externalIdAtual={livro.externalId} />}
      </Stack>

      <AvisoRetro aviso={aviso} aoFechar={() => setAviso(null)} />
    </PaginaComCard>
  );
}

// volta para a busca, a estante ou o autor, conforme a origem guardada na URL
function VoltarParaBusca({ busca }: { busca: BuscaLivro }) {
  const estilo = { alignSelf: "flex-start", fontFamily: fontes.corpo, fontWeight: 700, fontSize: 15, color: cores.terracotaEscura };

  if (busca.de === "estante") {
    return (
      <LinkRouter to="/estante" search={{ aba: busca.aba }} underline="hover" sx={estilo}>
        ← Voltar para a estante
      </LinkRouter>
    );
  }
  if (busca.de === "autor" && busca.autor) {
    return (
      <LinkRouter to="/autores/$autorId" params={{ autorId: busca.autor }} underline="hover" sx={estilo}>
        ← Voltar para o autor
      </LinkRouter>
    );
  }
  return (
    <LinkRouter to="/livros/buscar" search={{ q: busca.q, pagina: busca.pagina }} underline="hover" sx={estilo}>
      ← Voltar para a busca
    </LinkRouter>
  );
}

function CapaGrande({ livro }: { livro: DetalhesLivroCatalogo }) {
  const tamanho = { width: "100%", maxWidth: { xs: 240, md: "none" }, mx: { xs: "auto", md: 0 }, aspectRatio: "2 / 3" };

  if (livro.capaUrl) {
    return (
      <Box
        component="img"
        src={livro.capaUrl}
        alt={`Capa de ${livro.titulo}`}
        sx={{ ...tamanho, display: "block", objectFit: "cover", border: retro.borda, boxShadow: retro.sombra, borderRadius: 4, backgroundColor: cores.fundo }}
      />
    );
  }

  const estilo = estiloDoLivro(null, indiceDoId(livro.externalId));
  return (
    <Paper
      elevation={0}
      role="img"
      aria-label={`Livro sem capa: ${livro.titulo}`}
      sx={{
        ...tamanho,
        backgroundColor: estilo.fundo,
        border: retro.borda,
        boxShadow: retro.sombra,
        borderRadius: 4,
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 28, lineHeight: 1.1, color: estilo.texto }}>
        {livro.titulo}
      </Typography>
      <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, mt: 1, color: estilo.texto }}>{livro.autor}</Typography>
    </Paper>
  );
}

function LivroCarregando() {
  return (
    <PaginaComCard>
      <MensagemEstado titulo="Abrindo o livro..." texto="Buscando os detalhes na Open Library." />
    </PaginaComCard>
  );
}

function LivroErro() {
  const router = useRouter();
  const busca = Route.useSearch();

  return (
    <PaginaComCard>
      <Stack sx={{ gap: 3 }}>
        <VoltarParaBusca busca={busca} />
        <MensagemEstado
          titulo="Não conseguimos abrir este livro"
          texto="A Open Library não respondeu como esperado. Tente novamente em instantes."
          acao={
            <BotaoRetro onClick={() => router.invalidate()} sx={{ mt: 3 }}>
              Tentar de novo
            </BotaoRetro>
          }
        />
      </Stack>
    </PaginaComCard>
  );
}

function LivroNaoEncontrado() {
  const busca = Route.useSearch();

  return (
    <PaginaComCard>
      <Stack sx={{ gap: 3 }}>
        <VoltarParaBusca busca={busca} />
        <MensagemEstado titulo="Livro não encontrado" texto="Não encontramos este livro na Open Library. Que tal procurar outro?" />
      </Stack>
    </PaginaComCard>
  );
}
