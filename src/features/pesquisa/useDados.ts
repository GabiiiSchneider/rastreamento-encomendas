import { useEffect, useRef, useState } from "react";
import { mensagemDeErro } from "../livros/useListaPaginada";

export type EstadoDados<T> = { tipo: "carregando" } | { tipo: "erro"; mensagem: string } | { tipo: "pronto"; dados: T };

export function useDados<T>(chave: string, carregar: () => Promise<T>) {
  const [estado, setEstado] = useState<EstadoDados<T>>({ tipo: "carregando" });
  const carregarAtual = useRef(carregar);
  carregarAtual.current = carregar;

  useEffect(() => {
    let cancelado = false;
    setEstado({ tipo: "carregando" });
    carregarAtual
      .current()
      .then((dados) => !cancelado && setEstado({ tipo: "pronto", dados }))
      .catch((erro) => !cancelado && setEstado({ tipo: "erro", mensagem: mensagemDeErro(erro) }));
    return () => {
      cancelado = true;
    };
  }, [chave]);

  return estado;
}
