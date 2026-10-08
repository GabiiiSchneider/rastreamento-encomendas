import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Box, InputBase, Paper, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { PaginaComCard } from "../../../components/PaginaComCard";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { cores, fontes, retro } from "../../../lib/tema";
import type { LivroCatalogo } from "../../../catalogo/catalogo.port";
import { buscarLivros } from "../../../features/livros/livros.functions";
import { validarBuscaLivros } from "../../../features/livros/livros.busca";
import { useListaPaginada, type EstadoLista } from "../../../features/livros/useListaPaginada";
import { CartaoLivroBusca } from "../../../features/livros/components/CartaoLivroBusca";
import { GradeCarregando, gradeLivros } from "../../../features/livros/components/GradeLivros";
import { PaginacaoResponsiva } from "../../../features/livros/components/PaginacaoResponsiva";
import { MensagemEstado } from "../../../features/livros/components/MensagemEstado";

export const Route = createFileRoute("/_autenticado/livros/buscar")({
  validateSearch: validarBuscaLivros,
  component: BuscarLivrosPage,
});

function BuscarLivrosPage() {
  const { q, pagina = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [texto, setTexto] = useState(q ?? "");

  const lista = useListaPaginada<LivroCatalogo>({
    chave: q ?? null,
    pagina,
    carregar: async (numero) => {
      const resultado = await buscarLivros({ data: { termo: q ?? "", pagina: numero } });
      return { itens: resultado.livros, total: resultado.total, porPagina: resultado.porPagina };
    },
    // guarda a página na URL para o "voltar" retornar ao mesmo ponto
    aoCarregarMais: (proxima) => navigate({ search: (atual) => ({ ...atual, pagina: proxima }), replace: true, resetScroll: false }),
  });

  useEffect(() => {
    setTexto(q ?? "");
  }, [q]);

  function buscar(evento: FormEvent) {
    evento.preventDefault();
    const termo = texto.trim();
    if (!termo) return;
    if (termo === q && pagina === 1) {
      lista.tentarDeNovo();
      return;
    }
    navigate({ search: { q: termo } });
  }

  function irParaPagina(novaPagina: number) {
    navigate({ search: (atual) => ({ ...atual, pagina: novaPagina > 1 ? novaPagina : undefined }) });
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

        <Resultados lista={lista} q={q} pagina={pagina} aoMudarPagina={irParaPagina} />
      </Stack>
    </PaginaComCard>
  );
}

type ResultadosProps = {
  lista: ReturnType<typeof useListaPaginada<LivroCatalogo>>;
  q?: string;
  pagina: number;
  aoMudarPagina: (pagina: number) => void;
};

function Resultados({ lista, q, pagina, aoMudarPagina }: ResultadosProps) {
  const estado: EstadoLista<LivroCatalogo> = lista.estado;

  if (estado.tipo === "inicial") {
    return (
      <MensagemEstado
        titulo="Qual vai ser a próxima leitura?"
        texto="Digite o nome de um livro ou de um autor e aperte Buscar para encontrar livros na Open Library."
      />
    );
  }

  if (estado.tipo === "carregando") {
    return <GradeCarregando />;
  }

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

  if (estado.itens.length === 0) {
    return (
      <MensagemEstado
        titulo="Nenhum livro encontrado"
        texto={`Não achamos nada para "${q}". Confira a grafia ou tente buscar pelo nome do autor.`}
      />
    );
  }

  const busca = { q, pagina: pagina > 1 ? pagina : undefined };

  return (
    <Stack sx={{ gap: 3 }}>
      <Typography sx={{ fontFamily: fontes.corpo, fontSize: 15, color: cores.textoSuave }}>
        {estado.total.toLocaleString("pt-BR")} {estado.total === 1 ? "resultado" : "resultados"} para{" "}
        <Box component="span" sx={{ fontWeight: 700, color: cores.tinta }}>
          “{q}”
        </Box>
      </Typography>

      <Box sx={gradeLivros}>
        {estado.itens.map((livro) => (
          <CartaoLivroBusca key={livro.externalId} livro={livro} busca={busca} />
        ))}
      </Box>

      <PaginacaoResponsiva
        pagina={pagina}
        totalPaginas={lista.totalPaginas}
        temMais={lista.temMais}
        carregandoMais={lista.carregandoMais}
        erroMais={lista.erroMais}
        aoMudarPagina={aoMudarPagina}
        aoCarregarMais={lista.carregarMais}
      />
    </Stack>
  );
}
