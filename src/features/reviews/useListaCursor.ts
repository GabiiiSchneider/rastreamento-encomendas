import { useCallback, useEffect, useRef, useState } from "react";
import { mensagemDeErro } from "../livros/useListaPaginada";

type Pagina<T> = { itens: T[]; proximoCursor: string | null };

export function useListaCursor<T extends { id: string }>(chave: string, carregar: (cursor?: string) => Promise<Pagina<T>>) {
  const [itens, setItens] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const carregarAtual = useRef(carregar);
  carregarAtual.current = carregar;
  const versao = useRef(0);

  useEffect(() => {
    const minhaVersao = ++versao.current;
    setItens([]);
    setCursor(null);
    setErro(null);
    setCarregando(true);
    carregarAtual
      .current()
      .then((pagina) => {
        if (versao.current !== minhaVersao) return;
        setItens(pagina.itens);
        setCursor(pagina.proximoCursor);
      })
      .catch((e) => versao.current === minhaVersao && setErro(mensagemDeErro(e)))
      .finally(() => versao.current === minhaVersao && setCarregando(false));
  }, [chave, tentativa]);

  const carregarMais = useCallback(async () => {
    if (carregando || !cursor) return;
    const minhaVersao = versao.current;
    setCarregando(true);
    setErro(null);
    try {
      const pagina = await carregarAtual.current(cursor);
      if (versao.current !== minhaVersao) return;
      setItens((atuais) => {
        const vistos = new Set(atuais.map((item) => item.id));
        return [...atuais, ...pagina.itens.filter((item) => !vistos.has(item.id))];
      });
      setCursor(pagina.proximoCursor);
    } catch (e) {
      if (versao.current === minhaVersao) setErro(mensagemDeErro(e));
    } finally {
      if (versao.current === minhaVersao) setCarregando(false);
    }
  }, [carregando, cursor]);

  return {
    itens,
    carregando,
    erro,
    temMais: cursor !== null,
    carregandoInicio: carregando && itens.length === 0,
    carregarMais,
    recarregar: () => setTentativa((t) => t + 1),
    adicionarNoTopo: (item: T) => setItens((atuais) => [item, ...atuais.filter((atual) => atual.id !== item.id)]),
    remover: (id: string) => setItens((atuais) => atuais.filter((item) => item.id !== id)),
    atualizar: (item: T) => setItens((atuais) => atuais.map((atual) => (atual.id === item.id ? item : atual))),
  };
}

export type ListaCursor<T extends { id: string }> = ReturnType<typeof useListaCursor<T>>;
