import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Box, Chip, InputBase, Link, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { BotaoRetro } from "../../components/BotaoRetro";
import { IconeLupa } from "../../components/Icones";
import { cores, fontes, retro } from "../../lib/tema";
import type { AutorResumoCatalogo, LivroCatalogo } from "../../catalogo/catalogo.port";
import { LayoutFeed } from "../../features/feed/components/LayoutFeed";
import { buscarLivros } from "../../features/livros/livros.functions";
import { buscarAutores } from "../../features/autores/autores.functions";
import { buscarResenhas } from "../../features/reviews/reviews.functions";
import { buscarLeitores } from "../../features/social/social.functions";
import { TIPOS_PESQUISA, validarBuscaPesquisa, type TipoPesquisa } from "../../features/pesquisa/pesquisa";
import { useDados, type EstadoDados } from "../../features/pesquisa/useDados";
import { useListaPaginada } from "../../features/livros/useListaPaginada";
import { useListaCursor } from "../../features/reviews/useListaCursor";
import { CartaoLivroBusca } from "../../features/livros/components/CartaoLivroBusca";
import { GradeCarregando, gradeLivros } from "../../features/livros/components/GradeLivros";
import { PaginacaoResponsiva } from "../../features/livros/components/PaginacaoResponsiva";
import { MensagemEstado } from "../../features/livros/components/MensagemEstado";
import { CartaoAutor } from "../../features/autores/components/CartaoAutor";
import { CartaoResenha, CartaoResenhaCarregando } from "../../features/reviews/components/CartaoResenha";
import { ListaResenhas } from "../../features/reviews/components/ListaResenhas";
import { CartaoLeitor } from "../../features/social/components/CartaoLeitor";
import type { Resenha } from "../../features/reviews/reviews.types";
import type { Leitor } from "../../features/social/social.types";

export const Route = createFileRoute("/_autenticado/buscar")({
  validateSearch: validarBuscaPesquisa,
  component: PesquisaPage,
});

const PREVIA = { livros: 4, autores: 4, resenhas: 2, leitores: 4 };

const gradeAutores = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 2,
};

function PesquisaPage() {
  const { q, tipo = "tudo", pagina = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [texto, setTexto] = useState(q ?? "");

  useEffect(() => {
    setTexto(q ?? "");
  }, [q]);

  function pesquisar(evento: FormEvent) {
    evento.preventDefault();
    const termo = texto.trim();
    if (termo) navigate({ search: { q: termo, tipo: tipo === "tudo" ? undefined : tipo } });
  }

  function trocarTipo(novo: TipoPesquisa) {
    navigate({ search: { q, tipo: novo === "tudo" ? undefined : novo } });
  }

  return (
    <LayoutFeed pesquisaInicial={q} mostrarPesquisa={false}>
      <Paper elevation={0} sx={{ backgroundColor: cores.papel, border: retro.borda, boxShadow: retro.sombra, borderRadius: 6, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 34, md: 42 }, color: cores.terracota, lineHeight: 1 }}>
          Pesquisar
        </Typography>

        <Paper
          component="form"
          role="search"
          onSubmit={pesquisar}
          elevation={0}
          sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2, p: 1, pl: 2, backgroundColor: cores.fundo, border: retro.borda, borderRadius: 4 }}
        >
          <IconeLupa sx={{ color: cores.textoSuave, fontSize: 26 }} />
          <InputBase
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Livros, autores, resenhas ou leitores"
            autoFocus={!q}
            inputProps={{ "aria-label": "O que você procura?", enterKeyHint: "search" }}
            sx={{ flex: 1, minWidth: 0, fontFamily: fontes.corpo, fontSize: { xs: 16, md: 18 }, color: cores.tinta, "& input::placeholder": { color: cores.textoSuave, opacity: 1 } }}
          />
          <BotaoRetro type="submit" sx={{ px: { xs: 2, sm: 3 } }}>
            Buscar
          </BotaoRetro>
        </Paper>

        <Stack direction="row" role="group" aria-label="Tipo de resultado" sx={{ gap: 1, flexWrap: "wrap", mt: 2 }}>
          {TIPOS_PESQUISA.map((item) => {
            const selecionado = item.valor === tipo;
            return (
              <Chip
                key={item.valor}
                label={item.rotulo}
                clickable
                onClick={() => trocarTipo(item.valor)}
                aria-pressed={selecionado}
                sx={{
                  fontFamily: fontes.corpo,
                  fontWeight: 700,
                  border: `2px solid ${cores.tinta}`,
                  backgroundColor: selecionado ? cores.mostarda : cores.papel,
                  color: cores.tinta,
                  boxShadow: selecionado ? `2px 2px 0 ${cores.tinta}` : "none",
                  "&:hover": { backgroundColor: selecionado ? cores.mostardaEscura : cores.fundo },
                }}
              />
            );
          })}
        </Stack>
      </Paper>

      {!q ? (
        <MensagemEstado titulo="O que você procura?" texto="Pesquise por um livro, um autor, palavras de uma resenha ou o nome de um leitor." />
      ) : tipo === "tudo" ? (
        <ResultadosTudo key={q} q={q} aoVerMais={trocarTipo} />
      ) : tipo === "livros" ? (
        <ResultadosLivros key={q} q={q} pagina={pagina} />
      ) : tipo === "autores" ? (
        <ResultadosAutores key={q} q={q} pagina={pagina} />
      ) : tipo === "resenhas" ? (
        <ResultadosResenhas key={q} q={q} />
      ) : (
        <ResultadosLeitores key={q} q={q} pagina={pagina} />
      )}
    </LayoutFeed>
  );
}

function ResultadosTudo({ q, aoVerMais }: { q: string; aoVerMais: (tipo: TipoPesquisa) => void }) {
  const livros = useDados(q, () => buscarLivros({ data: { termo: q, pagina: 1 } }));
  const autores = useDados(q, () => buscarAutores({ data: { termo: q, pagina: 1, limite: PREVIA.autores } }));
  const resenhas = useDados(q, () => buscarResenhas({ data: { termo: q, limite: PREVIA.resenhas } }));
  const leitores = useDados(q, () => buscarLeitores({ data: { termo: q, pagina: 1, limite: PREVIA.leitores } }));

  const nadaEncontrado =
    livros.tipo === "pronto" &&
    livros.dados.livros.length === 0 &&
    autores.tipo === "pronto" &&
    autores.dados.autores.length === 0 &&
    resenhas.tipo === "pronto" &&
    resenhas.dados.resenhas.length === 0 &&
    leitores.tipo === "pronto" &&
    leitores.dados.leitores.length === 0;

  if (nadaEncontrado) {
    return <MensagemEstado titulo="Nada encontrado" texto={`Não achamos nada para “${q}”. Confira a grafia ou tente outras palavras.`} />;
  }

  return (
    <Stack sx={{ gap: 3 }}>
      <SecaoPrevia
        titulo="Livros"
        estado={livros}
        total={(d) => d.total}
        itens={(d) => d.livros.slice(0, PREVIA.livros)}
        aoVerMais={() => aoVerMais("livros")}
        carregando={<GradeCarregando quantidade={PREVIA.livros} />}
        render={(itens) => (
          <Box sx={gradeLivros}>
            {itens.map((livro) => (
              <CartaoLivroBusca key={livro.externalId} livro={livro} busca={{ de: "pesquisa", q }} />
            ))}
          </Box>
        )}
      />
      <SecaoPrevia
        titulo="Autores"
        estado={autores}
        total={(d) => d.total}
        itens={(d) => d.autores}
        aoVerMais={() => aoVerMais("autores")}
        carregando={<CarregandoLinhas quantidade={2} altura={112} />}
        render={(itens) => (
          <Box sx={gradeAutores}>
            {itens.map((autor) => (
              <CartaoAutor key={autor.id} autor={autor} />
            ))}
          </Box>
        )}
      />
      <SecaoPrevia
        titulo="Resenhas"
        estado={resenhas}
        total={(d) => (d.proximoCursor ? d.resenhas.length + 1 : d.resenhas.length)}
        mostrarTotal={false}
        itens={(d) => d.resenhas}
        aoVerMais={() => aoVerMais("resenhas")}
        carregando={<CartaoResenhaCarregando />}
        render={(itens) => (
          <Stack sx={{ gap: 2 }}>
            {itens.map((resenha) => (
              <CartaoResenha key={resenha.id} resenha={resenha} />
            ))}
          </Stack>
        )}
      />
      <SecaoPrevia
        titulo="Leitores"
        estado={leitores}
        total={(d) => d.total}
        itens={(d) => d.leitores}
        aoVerMais={() => aoVerMais("leitores")}
        carregando={<CarregandoLinhas quantidade={2} altura={64} />}
        render={(itens) => <ListaLeitores leitores={itens} />}
      />
    </Stack>
  );
}

type SecaoPreviaProps<D, I> = {
  titulo: string;
  estado: EstadoDados<D>;
  total: (dados: D) => number;
  itens: (dados: D) => I[];
  aoVerMais: () => void;
  carregando: ReactNode;
  render: (itens: I[]) => ReactNode;
  mostrarTotal?: boolean;
};

function SecaoPrevia<D, I>({ titulo, estado, total, itens, aoVerMais, carregando, render, mostrarTotal = true }: SecaoPreviaProps<D, I>) {
  if (estado.tipo === "pronto" && itens(estado.dados).length === 0) return null;

  const quantidade = estado.tipo === "pronto" ? total(estado.dados) : 0;
  const temMais = estado.tipo === "pronto" && quantidade > itens(estado.dados).length;

  return (
    <Box component="section" aria-label={titulo}>
      <Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between", gap: 2, mb: 1.5 }}>
        <Typography component="h2" sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 26, color: cores.tinta }}>
          {titulo}
          {mostrarTotal && estado.tipo === "pronto" && (
            <Box component="span" sx={{ fontFamily: fontes.corpo, fontStyle: "normal", fontWeight: 500, fontSize: 15, color: cores.textoSuave, ml: 1 }}>
              {quantidade.toLocaleString("pt-BR")}
            </Box>
          )}
        </Typography>
        {temMais && (
          <Link component="button" type="button" onClick={aoVerMais} underline="hover" sx={{ fontFamily: fontes.corpo, fontWeight: 700, fontSize: 15, color: cores.terracotaEscura }}>
            Ver mais →
          </Link>
        )}
      </Stack>
      {estado.tipo === "carregando" && carregando}
      {estado.tipo === "erro" && (
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>Não deu para buscar {titulo.toLowerCase()} agora.</Typography>
      )}
      {estado.tipo === "pronto" && render(itens(estado.dados))}
    </Box>
  );
}

function ResultadosLivros({ q, pagina }: { q: string; pagina: number }) {
  const navigate = Route.useNavigate();
  const lista = useListaPaginada<LivroCatalogo>({
    chave: q,
    pagina,
    carregar: async (numero) => {
      const resultado = await buscarLivros({ data: { termo: q, pagina: numero } });
      return { itens: resultado.livros, total: resultado.total, porPagina: resultado.porPagina };
    },
    aoCarregarMais: (proxima) => navigate({ search: (atual) => ({ ...atual, pagina: proxima }), replace: true, resetScroll: false }),
  });

  return (
    <ListaPaginada
      lista={lista}
      pagina={pagina}
      vazio={`Nenhum livro encontrado para “${q}”.`}
      carregando={<GradeCarregando />}
      render={(itens) => (
        <Box sx={gradeLivros}>
          {itens.map((livro) => (
            <CartaoLivroBusca key={livro.externalId} livro={livro} busca={{ de: "pesquisa", q }} />
          ))}
        </Box>
      )}
    />
  );
}

type ComChave<T> = T & { externalId: string };

function ResultadosAutores({ q, pagina }: { q: string; pagina: number }) {
  const navigate = Route.useNavigate();
  const lista = useListaPaginada<ComChave<AutorResumoCatalogo>>({
    chave: q,
    pagina,
    carregar: async (numero) => {
      const resultado = await buscarAutores({ data: { termo: q, pagina: numero } });
      return { itens: resultado.autores.map((autor) => ({ ...autor, externalId: autor.id })), total: resultado.total, porPagina: resultado.porPagina };
    },
    aoCarregarMais: (proxima) => navigate({ search: (atual) => ({ ...atual, pagina: proxima }), replace: true, resetScroll: false }),
  });

  return (
    <ListaPaginada
      lista={lista}
      pagina={pagina}
      vazio={`Nenhum autor encontrado para “${q}”.`}
      carregando={<CarregandoLinhas quantidade={4} altura={112} />}
      render={(itens) => (
        <Box sx={gradeAutores}>
          {itens.map((autor) => (
            <CartaoAutor key={autor.id} autor={autor} />
          ))}
        </Box>
      )}
    />
  );
}

function ResultadosLeitores({ q, pagina }: { q: string; pagina: number }) {
  const navigate = Route.useNavigate();
  const lista = useListaPaginada<ComChave<Leitor>>({
    chave: q,
    pagina,
    carregar: async (numero) => {
      const resultado = await buscarLeitores({ data: { termo: q, pagina: numero } });
      return { itens: resultado.leitores.map((leitor) => ({ ...leitor, externalId: leitor.id })), total: resultado.total, porPagina: resultado.porPagina };
    },
    aoCarregarMais: (proxima) => navigate({ search: (atual) => ({ ...atual, pagina: proxima }), replace: true, resetScroll: false }),
  });

  return (
    <ListaPaginada
      lista={lista}
      pagina={pagina}
      vazio={`Nenhum leitor encontrado para “${q}”.`}
      carregando={<CarregandoLinhas quantidade={4} altura={64} />}
      render={(itens) => <ListaLeitores leitores={itens} />}
    />
  );
}

function ResultadosResenhas({ q }: { q: string }) {
  const lista = useListaCursor<Resenha>(q, async (cursor) => {
    const pagina = await buscarResenhas({ data: { termo: q, cursor } });
    return { itens: pagina.resenhas, proximoCursor: pagina.proximoCursor };
  });
  return <ListaResenhas lista={lista} vazio={<MensagemEstado titulo="Nenhuma resenha encontrada" texto={`Nenhuma resenha fala de “${q}” ainda.`} />} />;
}

type ListaPaginadaProps<T extends { externalId: string }> = {
  lista: ReturnType<typeof useListaPaginada<T>>;
  pagina: number;
  vazio: string;
  carregando: ReactNode;
  render: (itens: T[]) => ReactNode;
};

function ListaPaginada<T extends { externalId: string }>({ lista, pagina, vazio, carregando, render }: ListaPaginadaProps<T>) {
  const navigate = Route.useNavigate();
  const { estado } = lista;

  if (estado.tipo === "inicial" || estado.tipo === "carregando") return <>{carregando}</>;
  if (estado.tipo === "erro") {
    return (
      <MensagemEstado
        titulo="Não deu para buscar agora"
        texto={estado.mensagem}
        acao={
          <BotaoRetro onClick={lista.tentarDeNovo} sx={{ mt: 3 }}>
            Tentar de novo
          </BotaoRetro>
        }
      />
    );
  }
  if (estado.itens.length === 0) return <MensagemEstado titulo="Nada encontrado" texto={vazio} />;

  return (
    <Stack sx={{ gap: 3 }}>
      <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave }}>
        {estado.total.toLocaleString("pt-BR")} {estado.total === 1 ? "resultado" : "resultados"}
      </Typography>
      {render(estado.itens)}
      <PaginacaoResponsiva
        pagina={pagina}
        totalPaginas={lista.totalPaginas}
        temMais={lista.temMais}
        carregandoMais={lista.carregandoMais}
        erroMais={lista.erroMais}
        aoMudarPagina={(nova) => navigate({ search: (atual) => ({ ...atual, pagina: nova > 1 ? nova : undefined }) })}
        aoCarregarMais={lista.carregarMais}
      />
    </Stack>
  );
}

function ListaLeitores({ leitores }: { leitores: Leitor[] }) {
  return (
    <Paper elevation={0} sx={{ backgroundColor: cores.papel, border: retro.borda, boxShadow: retro.sombraLeve, borderRadius: 5, p: { xs: 2, md: 2.5 } }}>
      <Stack sx={{ gap: 2 }}>
        {leitores.map((leitor) => (
          <CartaoLeitor key={leitor.id} leitor={leitor} mostrarBio />
        ))}
      </Stack>
    </Paper>
  );
}

function CarregandoLinhas({ quantidade, altura }: { quantidade: number; altura: number }) {
  return (
    <Stack sx={{ gap: 2 }} aria-busy="true" aria-label="Carregando resultados">
      {Array.from({ length: quantidade }, (_, i) => (
        <Skeleton key={i} variant="rounded" height={altura} sx={{ borderRadius: 4, backgroundColor: cores.fundo, border: `2px solid ${cores.textoClaro}` }} />
      ))}
    </Stack>
  );
}
