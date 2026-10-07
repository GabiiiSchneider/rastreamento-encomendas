import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { Box, Stack, Typography } from "@mui/material";
import { PaginaComCard } from "../../components/PaginaComCard";
import { BotaoRetro } from "../../components/BotaoRetro";
import { cores, fontes } from "../../lib/tema";
import type { AutorCatalogo, LivroCatalogo } from "../../catalogo/catalogo.port";
import { listarLivrosDoAutor, obterAutor } from "../../features/autores/autores.functions";
import { BiografiaAutor, DatasAutor, FotoAutor } from "../../features/autores/components/InfoAutor";
import { useListaPaginada } from "../../features/livros/useListaPaginada";
import { CartaoLivroBusca } from "../../features/livros/components/CartaoLivroBusca";
import { GradeCarregando, gradeLivros } from "../../features/livros/components/GradeLivros";
import { PaginacaoResponsiva } from "../../features/livros/components/PaginacaoResponsiva";
import { MensagemEstado } from "../../features/livros/components/MensagemEstado";

type BuscaAutor = { pagina?: number };

function validarBuscaAutor(search: Record<string, unknown>): BuscaAutor {
  const pagina = Number(search.pagina);
  return { pagina: Number.isInteger(pagina) && pagina > 1 ? pagina : undefined };
}

export const Route = createFileRoute("/autores/$autorId")({
  validateSearch: validarBuscaAutor,
  loader: async ({ params }) => {
    const autor = await obterAutor({ data: { autorId: params.autorId } });
    if (!autor) throw notFound();
    return { autor };
  },
  component: AutorPage,
  pendingComponent: AutorCarregando,
  errorComponent: AutorErro,
  notFoundComponent: AutorNaoEncontrado,
});

function AutorPage() {
  const { autor } = Route.useLoaderData();
  return <DetalhesAutor key={autor.id} autor={autor} />;
}

function DetalhesAutor({ autor }: { autor: AutorCatalogo }) {
  const { pagina = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();

  const lista = useListaPaginada<LivroCatalogo>({
    chave: autor.id,
    pagina,
    carregar: async (numero) => {
      const resultado = await listarLivrosDoAutor({ data: { autorId: autor.id, pagina: numero } });
      return { itens: resultado.livros, total: resultado.total, porPagina: resultado.porPagina };
    },
    aoCarregarMais: (proxima) => navigate({ search: { pagina: proxima }, replace: true, resetScroll: false }),
  });
  const { estado } = lista;

  function irParaPagina(novaPagina: number) {
    navigate({ search: { pagina: novaPagina > 1 ? novaPagina : undefined } });
  }

  return (
    <PaginaComCard>
      <Stack sx={{ gap: 5 }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ gap: { xs: 3, md: 5 }, alignItems: { xs: "center", md: "flex-start" } }}>
          <FotoAutor autor={autor} tamanho={{ xs: 180, md: 240 }} />
          <Stack sx={{ gap: 2, minWidth: 0, width: "100%" }}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography
                component="h1"
                sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 36, md: 48 }, color: cores.terracota, lineHeight: 1.05 }}
              >
                {autor.nome}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <DatasAutor autor={autor} />
              </Box>
            </Box>
            <BiografiaAutor texto={autor.biografia} completa />
          </Stack>
        </Stack>

        <Stack sx={{ gap: 3 }}>
          <Box>
            <Typography component="h2" sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 28, md: 34 }, color: cores.tinta, lineHeight: 1.1 }}>
              Livros de {autor.nome}
            </Typography>
            {estado.tipo === "pronto" && estado.total > 0 && (
              <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave, mt: 0.5 }}>
                {estado.total.toLocaleString("pt-BR")} {estado.total === 1 ? "obra" : "obras"}, das mais lidas para as menos lidas
              </Typography>
            )}
          </Box>

          {estado.tipo === "inicial" || estado.tipo === "carregando" ? (
            <GradeCarregando />
          ) : estado.tipo === "erro" ? (
            <MensagemEstado
              titulo="Não deu para carregar os livros"
              texto={estado.mensagem}
              acao={
                <BotaoRetro onClick={lista.tentarDeNovo} sx={{ mt: 3 }}>
                  Tentar de novo
                </BotaoRetro>
              }
            />
          ) : estado.itens.length === 0 ? (
            <MensagemEstado titulo="Nenhum livro encontrado" texto="A Open Library ainda não tem livros cadastrados para este autor." />
          ) : (
            <>
              <Box sx={gradeLivros}>
                {estado.itens.map((livro) => (
                  <CartaoLivroBusca key={livro.externalId} livro={livro} busca={{ de: "autor", autor: autor.id }} />
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
            </>
          )}
        </Stack>
      </Stack>
    </PaginaComCard>
  );
}

function AutorCarregando() {
  return (
    <PaginaComCard>
      <MensagemEstado titulo="Abrindo a página do autor..." texto="Buscando a biografia e os livros na Open Library." />
    </PaginaComCard>
  );
}

function AutorErro() {
  const router = useRouter();
  return (
    <PaginaComCard>
      <MensagemEstado
        titulo="Não conseguimos abrir esta página"
        texto="A Open Library não respondeu como esperado. Tente novamente em instantes."
        acao={
          <BotaoRetro onClick={() => router.invalidate()} sx={{ mt: 3 }}>
            Tentar de novo
          </BotaoRetro>
        }
      />
    </PaginaComCard>
  );
}

function AutorNaoEncontrado() {
  return (
    <PaginaComCard>
      <MensagemEstado titulo="Autor não encontrado" texto="Não encontramos este autor na Open Library." />
    </PaginaComCard>
  );
}
