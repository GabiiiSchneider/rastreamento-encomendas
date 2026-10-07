import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { PaginaComCard } from "../components/PaginaComCard";
import { BotaoRetro } from "../components/BotaoRetro";
import { cores, fontes, retro } from "../lib/tema";
import type { LivroNaEstante } from "../features/livros/livros.types";
import { listarEstantePaginada } from "../features/livros/livros.functions";
import { ABAS_ESTANTE, ABA_PADRAO, dadosDaAba, validarBuscaEstante, type AbaEstante } from "../features/livros/livros.estante";
import { useListaPaginada } from "../features/livros/useListaPaginada";
import { CartaoLivroBusca } from "../features/livros/components/CartaoLivroBusca";
import { GradeCarregando, gradeLivros } from "../features/livros/components/GradeLivros";
import { PaginacaoResponsiva } from "../features/livros/components/PaginacaoResponsiva";
import { MensagemEstado } from "../features/livros/components/MensagemEstado";

export const Route = createFileRoute("/estante")({
  validateSearch: validarBuscaEstante,
  component: EstantePage,
});

function EstantePage() {
  const { aba = ABA_PADRAO, pagina = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();
  const irPara = useNavigate();
  const dados = dadosDaAba(aba);

  const lista = useListaPaginada<LivroNaEstante>({
    chave: aba,
    pagina,
    carregar: async (numero) => {
      const resultado = await listarEstantePaginada({ data: { aba, pagina: numero } });
      return { itens: resultado.livros, total: resultado.total, porPagina: resultado.porPagina };
    },
    aoCarregarMais: (proxima) => navigate({ search: (atual) => ({ ...atual, pagina: proxima }), replace: true, resetScroll: false }),
  });
  const { estado } = lista;

  function trocarAba(novaAba: AbaEstante) {
    navigate({ search: { aba: novaAba }, replace: true });
  }

  function irParaPagina(novaPagina: number) {
    navigate({ search: (atual) => ({ ...atual, pagina: novaPagina > 1 ? novaPagina : undefined }) });
  }

  const adicionarLivro = (
    <BotaoRetro onClick={() => irPara({ to: "/livros/buscar" })} sx={{ mt: 3 }}>
      + Adicionar livro
    </BotaoRetro>
  );

  return (
    <PaginaComCard>
      <Stack sx={{ gap: 4 }}>
        <Box>
          <Typography
            component="h1"
            sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 38, md: 48 }, color: cores.terracota, lineHeight: 1 }}
          >
            Minha estante
          </Typography>
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.textoSuave, mt: 1 }}>
            Todos os livros que você leu, está lendo ou quer ler.
          </Typography>
        </Box>

        <Tabs
          value={aba}
          onChange={(_, nova: AbaEstante) => trocarAba(nova)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Filtrar a estante"
          sx={{
            minHeight: 0,
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTabs-flexContainer": { gap: 1.5, p: 0.5, pb: 1 },
            "& .MuiTabs-scrollButtons": { color: cores.tinta, "&.Mui-disabled": { opacity: 0.3 } },
          }}
        >
          {ABAS_ESTANTE.map((item) => (
            <Tab
              key={item.valor}
              value={item.valor}
              label={item.rotulo}
              disableRipple
              sx={{
                minHeight: 0,
                px: 2.5,
                py: 1,
                borderRadius: 3,
                border: retro.borda,
                backgroundColor: cores.papel,
                color: cores.tinta,
                fontFamily: fontes.corpo,
                fontWeight: 700,
                fontSize: 15,
                textTransform: "none",
                opacity: 1,
                transition: "transform 0.15s, box-shadow 0.15s",
                "&:hover": { backgroundColor: cores.fundo, boxShadow: retro.sombraLeve },
                "&.Mui-selected": { backgroundColor: cores.mostarda, color: cores.tinta, boxShadow: retro.sombraLeve },
                "&.Mui-focusVisible": { outline: `3px solid ${cores.terracota}`, outlineOffset: 2 },
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            />
          ))}
        </Tabs>

        {estado.tipo === "inicial" || estado.tipo === "carregando" ? (
          <GradeCarregando />
        ) : estado.tipo === "erro" ? (
          <MensagemEstado
            titulo="Não deu para abrir sua estante"
            texto={estado.mensagem}
            acao={
              <BotaoRetro onClick={lista.tentarDeNovo} sx={{ mt: 3 }}>
                Tentar de novo
              </BotaoRetro>
            }
          />
        ) : estado.itens.length === 0 ? (
          <MensagemEstado titulo={dados.vazio.titulo} texto={dados.vazio.texto} acao={adicionarLivro} />
        ) : (
          <Stack sx={{ gap: 3 }}>
            <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave }}>
              {estado.total.toLocaleString("pt-BR")} {estado.total === 1 ? "livro" : "livros"} em{" "}
              <Box component="span" sx={{ fontWeight: 700, color: cores.tinta }}>
                “{dados.rotulo}”
              </Box>
            </Typography>

            <Box sx={gradeLivros}>
              {estado.itens.map((livro) => (
                <CartaoLivroBusca key={livro.externalId} livro={livro} busca={{ de: "estante", aba }} />
              ))}
            </Box>

            <PaginacaoResponsiva
              pagina={pagina}
              totalPaginas={lista.totalPaginas}
              temMais={lista.temMais}
              carregandoMais={lista.carregandoMais}
              erroMais={lista.erroMais}
              aoMudarPagina={irParaPagina}
              aoCarregarMais={lista.carregarMais}
            />
          </Stack>
        )}
      </Stack>
    </PaginaComCard>
  );
}
