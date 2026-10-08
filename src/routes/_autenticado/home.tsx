import { useEffect } from "react";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { Chip, Stack, Tab, Tabs } from "@mui/material";
import { BotaoRetro } from "../../components/BotaoRetro";
import { cores, fontes, retro } from "../../lib/tema";
import { LayoutFeed, ANCORA_ESCREVER } from "../../features/feed/components/LayoutFeed";
import { MensagemEstado } from "../../features/livros/components/MensagemEstado";
import { QuemSeguir } from "../../features/social/components/QuemSeguir";
import { CaixaNovaResenha, focarCaixaResenha } from "../../features/reviews/components/CaixaNovaResenha";
import { ListaResenhas } from "../../features/reviews/components/ListaResenhas";
import { listarFeed } from "../../features/reviews/reviews.functions";
import { ABAS_FEED, FILTROS_SPOILER, validarBuscaFeed, type AbaFeed, type FiltroSpoiler } from "../../features/reviews/reviews.feed";
import { useListaCursor } from "../../features/reviews/useListaCursor";
import type { Resenha } from "../../features/reviews/reviews.types";

export const Route = createFileRoute("/_autenticado/home")({
  validateSearch: validarBuscaFeed,
  component: FeedPage,
});

function FeedPage() {
  const { aba = "novidades", filtro = "todas" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { hash } = useLocation();

  const lista = useListaCursor<Resenha>(`${aba}:${filtro}`, async (cursor) => {
    const pagina = await listarFeed({ data: { aba, filtro, cursor } });
    return { itens: pagina.resenhas, proximoCursor: pagina.proximoCursor };
  });

  useEffect(() => {
    if (hash === ANCORA_ESCREVER) focarCaixaResenha();
  }, [hash]);

  function trocarAba(novaAba: AbaFeed) {
    navigate({ search: novaAba === "novidades" ? {} : { aba: novaAba }, replace: true });
  }

  function trocarFiltro(novoFiltro: FiltroSpoiler) {
    navigate({ search: { aba: "resenhas", filtro: novoFiltro === "todas" ? undefined : novoFiltro }, replace: true });
  }

  function aoPublicar(resenha: Resenha) {
    if (aba !== "resenhas") lista.adicionarNoTopo(resenha);
    else navigate({ search: {}, replace: true });
  }

  const vazio =
    aba === "seguindo" ? (
      <Stack sx={{ gap: 2.5 }}>
        <MensagemEstado titulo="Você ainda não segue ninguém" texto="Siga outros leitores para ver as resenhas deles aqui. Que tal começar por estas pessoas?" />
        <QuemSeguir limite={5} titulo="Sugestões para seguir" />
      </Stack>
    ) : (
      <MensagemEstado
        titulo={filtro === "com-spoiler" ? "Nenhuma resenha com spoiler" : filtro === "sem-spoiler" ? "Nenhuma resenha sem spoiler" : "Nenhuma resenha por aqui ainda"}
        texto="Seja a primeira pessoa a contar o que achou de um livro."
        acao={
          <BotaoRetro onClick={focarCaixaResenha} sx={{ mt: 3 }}>
            Escrever resenha
          </BotaoRetro>
        }
      />
    );

  return (
    <LayoutFeed aoEscrever={focarCaixaResenha}>
      <CaixaNovaResenha aoPublicar={aoPublicar} />

      <Tabs
        value={aba}
        onChange={(_, nova: AbaFeed) => trocarAba(nova)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Tipo de feed"
        sx={{
          minHeight: 0,
          backgroundColor: cores.papel,
          border: retro.borda,
          boxShadow: retro.sombraLeve,
          borderRadius: 4,
          p: 0.75,
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTabs-flexContainer": { gap: 0.75 },
        }}
      >
        {ABAS_FEED.map((item) => (
          <Tab
            key={item.valor}
            value={item.valor}
            label={item.rotulo}
            disableRipple
            sx={{
              flex: { xs: "1 0 auto", sm: 1 },
              minHeight: 0,
              py: 1,
              borderRadius: 3,
              color: cores.tinta,
              fontFamily: fontes.corpo,
              fontWeight: 700,
              fontSize: 15,
              textTransform: "none",
              opacity: 1,
              "&:hover": { backgroundColor: cores.fundo },
              "&.Mui-selected": { backgroundColor: cores.mostarda, color: cores.tinta },
              "&.Mui-focusVisible": { outline: `3px solid ${cores.terracota}`, outlineOffset: 2 },
            }}
          />
        ))}
      </Tabs>

      {aba === "resenhas" && (
        <Stack direction="row" role="group" aria-label="Filtrar por spoiler" sx={{ gap: 1, flexWrap: "wrap" }}>
          {FILTROS_SPOILER.map((item) => {
            const selecionado = item.valor === filtro;
            return (
              <Chip
                key={item.valor}
                label={item.rotulo}
                clickable
                onClick={() => trocarFiltro(item.valor)}
                aria-pressed={selecionado}
                sx={{
                  fontFamily: fontes.corpo,
                  fontWeight: 700,
                  border: `2px solid ${cores.tinta}`,
                  backgroundColor: selecionado ? cores.tinta : cores.papel,
                  color: selecionado ? cores.papel : cores.tinta,
                  "&:hover": { backgroundColor: selecionado ? cores.tintaClara : cores.fundo },
                }}
              />
            );
          })}
        </Stack>
      )}

      <ListaResenhas lista={lista} vazio={vazio} />
    </LayoutFeed>
  );
}
