import { useEffect, useRef, useState } from "react";

export type PaginaDeItens<T> = { itens: T[]; total: number; porPagina: number };

export type EstadoLista<T> =
  | { tipo: "inicial" }
  | { tipo: "carregando" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "pronto"; itens: T[]; total: number; porPagina: number; ultimaPagina: number };

type Opcoes<T> = {
  // identifica a lista (termo da busca, aba, autor); null quando não há nada para carregar
  chave: string | null;
  pagina: number;
  carregar: (pagina: number) => Promise<PaginaDeItens<T>>;
  // chamado depois do "Carregar mais", para guardar a página na URL
  aoCarregarMais: (pagina: number) => void;
};

export function mensagemDeErro(erro: unknown) {
  return erro instanceof Error && erro.message ? erro.message : "Algo deu errado ao carregar os livros.";
}

function semRepetidos<T extends { externalId: string }>(itens: T[]) {
  const vistos = new Set<string>();
  return itens.filter((item) => !vistos.has(item.externalId) && vistos.add(item.externalId));
}

// no computador mostra uma página por vez; no celular o "Carregar mais" vai acumulando as páginas
export function useListaPaginada<T extends { externalId: string }>({ chave, pagina, carregar, aoCarregarMais }: Opcoes<T>) {
  const [estado, setEstado] = useState<EstadoLista<T>>({ tipo: chave === null ? "inicial" : "carregando" });
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erroMais, setErroMais] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const jaCarregado = useRef<{ chave: string; pagina: number } | null>(null);
  const carregarAtual = useRef(carregar);
  carregarAtual.current = carregar;

  useEffect(() => {
    setErroMais(null);
    if (chave === null) {
      jaCarregado.current = null;
      setEstado({ tipo: "inicial" });
      return;
    }
    if (jaCarregado.current?.chave === chave && jaCarregado.current.pagina === pagina) return;

    let cancelado = false;
    setEstado({ tipo: "carregando" });
    carregarAtual
      .current(pagina)
      .then((resultado) => {
        if (cancelado) return;
        jaCarregado.current = { chave, pagina };
        setEstado({
          tipo: "pronto",
          itens: semRepetidos(resultado.itens),
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
  }, [chave, pagina, tentativa]);

  function tentarDeNovo() {
    jaCarregado.current = null;
    setTentativa((t) => t + 1);
  }

  async function carregarMais() {
    if (estado.tipo !== "pronto" || chave === null) return;
    const proxima = estado.ultimaPagina + 1;

    setCarregandoMais(true);
    setErroMais(null);
    try {
      const resultado = await carregarAtual.current(proxima);
      jaCarregado.current = { chave, pagina: proxima };
      setEstado((atual) =>
        atual.tipo === "pronto"
          ? { ...atual, itens: semRepetidos([...atual.itens, ...resultado.itens]), total: resultado.total, ultimaPagina: proxima }
          : atual,
      );
      aoCarregarMais(proxima);
    } catch (erro) {
      setErroMais(mensagemDeErro(erro));
    } finally {
      setCarregandoMais(false);
    }
  }

  const totalPaginas = estado.tipo === "pronto" ? Math.max(1, Math.ceil(estado.total / estado.porPagina)) : 1;
  const temMais = estado.tipo === "pronto" && estado.ultimaPagina < totalPaginas;

  return { estado, carregandoMais, erroMais, tentarDeNovo, carregarMais, totalPaginas, temMais };
}
