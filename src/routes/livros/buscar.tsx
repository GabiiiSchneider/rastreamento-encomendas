import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Box, InputBase, Pagination, Paper, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { PaginaComCard } from "../../components/PaginaComCard";
import { BotaoRetro } from "../../components/BotaoRetro";
import { cores, fontes, retro } from "../../lib/tema";
import type { LivroCatalogo } from "../../catalogo/catalogo.port";
import { buscarLivros } from "../../features/livros/livros.functions";
import { validarBuscaLivros } from "../../features/livros/livros.busca";
import { CartaoLivroBusca, CartaoLivroCarregando } from "../../features/livros/components/CartaoLivroBusca";
import { MensagemEstado } from "../../features/livros/components/MensagemEstado";

export const Route = createFileRoute("/livros/buscar")({
  validateSearch: validarBuscaLivros,
  component: BuscarLivrosPage,
});

type EstadoBusca =
  | { tipo: "inicial" }
  | { tipo: "carregando" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "pronto"; livros: LivroCatalogo[]; total: number; porPagina: number; ultimaPagina: number };

const ITENS_CARREGANDO = 8;

function mensagemDeErro(erro: unknown) {
  return erro instanceof Error && erro.message ? erro.message : "Algo deu errado ao buscar os livros.";
}

function semRepetidos(livros: LivroCatalogo[]) {
  const vistos = new Set<string>();
  return livros.filter((livro) => !vistos.has(livro.externalId) && vistos.add(livro.externalId));
}

function BuscarLivrosPage() {
  const { q, pagina = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [texto, setTexto] = useState(q ?? "");
  const [estado, setEstado] = useState<EstadoBusca>({ tipo: q ? "carregando" : "inicial" });
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erroMais, setErroMais] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const jaCarregado = useRef<{ q: string; pagina: number } | null>(null);

  useEffect(() => {
    setTexto(q ?? "");
  }, [q]);

  useEffect(() => {
    setErroMais(null);
    if (!q) {
      jaCarregado.current = null;
      setEstado({ tipo: "inicial" });
      return;
    }
    if (jaCarregado.current?.q === q && jaCarregado.current.pagina === pagina) return;

    let cancelado = false;
    setEstado({ tipo: "carregando" });
    buscarLivros({ data: { termo: q, pagina } })
      .then((resultado) => {
        if (cancelado) return;
        jaCarregado.current = { q, pagina };
        setEstado({
          tipo: "pronto",
          livros: semRepetidos(resultado.livros),
          total: resultado.total,
          porPagina: resultado.porPagina,
          ultimaPagina: pagina,
        });
      })
      .catch((erro) => {
        if (!cancelado) setEstado({ tipo: "erro", mensagem: mensagemDeErro(erro) });
      });

    return () => {
      cancelado = true;
    };
  }, [q, pagina, tentativa]);

  function tentarDeNovo() {
    jaCarregado.current = null;
    setTentativa((t) => t + 1);
  }

  function buscar(evento: FormEvent) {
    evento.preventDefault();
    const termo = texto.trim();
    if (!termo) return;
    if (termo === q && pagina === 1) {
      tentarDeNovo();
      return;
    }
    navigate({ search: { q: termo } });
  }

  function irParaPagina(novaPagina: number) {
    navigate({ search: (atual) => ({ ...atual, pagina: novaPagina > 1 ? novaPagina : undefined }) });
  }

  async function carregarMais() {
    if (estado.tipo !== "pronto" || !q) return;
    const proxima = estado.ultimaPagina + 1;

    setCarregandoMais(true);
    setErroMais(null);
    try {
      const resultado = await buscarLivros({ data: { termo: q, pagina: proxima } });
      jaCarregado.current = { q, pagina: proxima };
      setEstado((atual) =>
        atual.tipo === "pronto"
          ? { ...atual, livros: semRepetidos([...atual.livros, ...resultado.livros]), total: resultado.total, ultimaPagina: proxima }
          : atual,
      );
      // guarda a página na URL para o "voltar" retornar ao mesmo ponto
      navigate({ search: (atual) => ({ ...atual, pagina: proxima }), replace: true, resetScroll: false });
    } catch (erro) {
      setErroMais(mensagemDeErro(erro));
    } finally {
      setCarregandoMais(false);
    }
  }

  return (
    <PaginaComCard>
      <Stack sx={{ gap: 4 }}>
        <Box>
          <Typography
            component="h1"
            sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: { xs: 38, md: 48 }, color: cores.terracota, lineHeight: 1 }}
          >
            Adicionar livros
          </Typography>
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.textoSuave, mt: 1 }}>
            Procure pelo título ou autor e coloque o livro na sua estante.
          </Typography>
        </Box>

        <Paper
          component="form"
          role="search"
          onSubmit={buscar}
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            gap: 1.5,
            p: 1.5,
            pl: 2.5,
            backgroundColor: cores.fundo,
            border: retro.borda,
            boxShadow: retro.sombraLeve,
            borderRadius: 4,
          }}
        >
          <SearchIcon sx={{ color: cores.textoSuave, fontSize: 30 }} />
          <InputBase
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ex.: Dom Casmurro, Clarice Lispector..."
            inputProps={{ "aria-label": "Buscar livros por título ou autor" }}
            sx={{
              flex: 1,
              minWidth: 0,
              fontFamily: fontes.corpo,
              fontSize: { xs: 18, md: 22 },
              color: cores.tinta,
              "& input::placeholder": { color: cores.textoSuave, opacity: 1 },
            }}
          />
          <BotaoRetro type="submit" sx={{ width: { xs: "100%", sm: "auto" }, px: 4 }}>
            Buscar
          </BotaoRetro>
        </Paper>

        <Resultados
          estado={estado}
          q={q}
          pagina={pagina}
          carregandoMais={carregandoMais}
          erroMais={erroMais}
          aoTentarDeNovo={tentarDeNovo}
          aoMudarPagina={irParaPagina}
          aoCarregarMais={carregarMais}
        />
      </Stack>
    </PaginaComCard>
  );
}

type ResultadosProps = {
  estado: EstadoBusca;
  q?: string;
  pagina: number;
  carregandoMais: boolean;
  erroMais: string | null;
  aoTentarDeNovo: () => void;
  aoMudarPagina: (pagina: number) => void;
  aoCarregarMais: () => void;
};

const grade = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
  gap: { xs: 2, md: 3 },
};

function Resultados({ estado, q, pagina, carregandoMais, erroMais, aoTentarDeNovo, aoMudarPagina, aoCarregarMais }: ResultadosProps) {
  if (estado.tipo === "inicial") {
    return (
      <MensagemEstado
        titulo="Qual vai ser a próxima leitura?"
        texto="Digite o nome de um livro ou de um autor e aperte Buscar para encontrar livros na Open Library."
      />
    );
  }

  if (estado.tipo === "carregando") {
    return (
      <Box sx={grade} aria-busy="true" aria-label="Carregando resultados">
        {Array.from({ length: ITENS_CARREGANDO }, (_, i) => (
          <CartaoLivroCarregando key={i} />
        ))}
      </Box>
    );
  }

  if (estado.tipo === "erro") {
    return (
      <MensagemEstado
        titulo="Não deu para buscar agora"
        texto={estado.mensagem}
        acao={
          <BotaoRetro onClick={aoTentarDeNovo} sx={{ mt: 3 }}>
            Tentar de novo
          </BotaoRetro>
        }
      />
    );
  }

  if (estado.livros.length === 0) {
    return (
      <MensagemEstado
        titulo="Nenhum livro encontrado"
        texto={`Não achamos nada para "${q}". Confira a grafia ou tente buscar pelo nome do autor.`}
      />
    );
  }

  const totalPaginas = Math.max(1, Math.ceil(estado.total / estado.porPagina));
  const temMais = estado.ultimaPagina < totalPaginas;
  const busca = { q, pagina: pagina > 1 ? pagina : undefined };

  return (
    <Stack sx={{ gap: 3 }}>
      <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave }}>
        {estado.total.toLocaleString("pt-BR")} {estado.total === 1 ? "resultado" : "resultados"} para{" "}
        <Box component="span" sx={{ fontWeight: 700, color: cores.tinta }}>
          “{q}”
        </Box>
      </Typography>

      <Box sx={grade}>
        {estado.livros.map((livro) => (
          <CartaoLivroBusca key={livro.externalId} livro={livro} busca={busca} />
        ))}
      </Box>

      {totalPaginas > 1 && (
        <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "center", pt: 1 }}>
          <Pagination
            count={totalPaginas}
            page={Math.min(pagina, totalPaginas)}
            onChange={(_, novaPagina) => aoMudarPagina(novaPagina)}
            shape="rounded"
            siblingCount={1}
            sx={{
              "& .MuiPagination-ul": { gap: 1 },
              "& .MuiPaginationItem-root": {
                fontFamily: fontes.corpo,
                fontWeight: 700,
                color: cores.tinta,
                backgroundColor: cores.papel,
                border: retro.borda,
                borderRadius: 2,
                minWidth: 40,
                height: 40,
                "&:hover": { backgroundColor: cores.fundo },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: cores.mostarda,
                boxShadow: retro.sombraLeve,
                "&:hover": { backgroundColor: cores.mostardaEscura },
              },
              "& .MuiPaginationItem-ellipsis": { border: "none", backgroundColor: "transparent" },
            }}
          />
        </Box>
      )}

      {carregandoMais && (
        <Box sx={{ ...grade, display: { xs: "grid", sm: "none" } }}>
          {Array.from({ length: 2 }, (_, i) => (
            <CartaoLivroCarregando key={i} />
          ))}
        </Box>
      )}

      <Stack sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 1.5, pt: 1 }}>
        {erroMais && (
          <Typography role="alert" sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.terracotaEscura, textAlign: "center" }}>
            {erroMais}
          </Typography>
        )}
        {temMais ? (
          <BotaoRetro onClick={aoCarregarMais} disabled={carregandoMais} sx={{ width: "100%" }}>
            {carregandoMais ? "Carregando..." : erroMais ? "Tentar carregar de novo" : "Carregar mais"}
          </BotaoRetro>
        ) : (
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>
            Você chegou ao fim da lista.
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
