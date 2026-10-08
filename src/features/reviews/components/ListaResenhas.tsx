import { useEffect, useRef, type ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { cores, fontes } from "../../../lib/tema";
import { MensagemEstado } from "../../livros/components/MensagemEstado";
import type { ListaCursor } from "../useListaCursor";
import type { Resenha } from "../reviews.types";
import { CartaoResenha, CartaoResenhaCarregando } from "./CartaoResenha";

type Props = {
  lista: ListaCursor<Resenha>;
  vazio: ReactNode;
};

export function ListaResenhas({ lista, vazio }: Props) {
  const sentinela = useRef<HTMLDivElement>(null);
  const { carregarMais, temMais, carregando, erro } = lista;

  useEffect(() => {
    const alvo = sentinela.current;
    if (!alvo || !temMais || carregando || erro || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) carregarMais();
      },
      { rootMargin: "400px 0px" },
    );
    observador.observe(alvo);
    return () => observador.disconnect();
  }, [carregarMais, temMais, carregando, erro]);

  if (lista.carregandoInicio) {
    return (
      <Stack sx={{ gap: 2 }} aria-busy="true" aria-label="Carregando resenhas">
        {Array.from({ length: 3 }, (_, i) => (
          <CartaoResenhaCarregando key={i} />
        ))}
      </Stack>
    );
  }

  if (erro && lista.itens.length === 0) {
    return (
      <MensagemEstado
        titulo="Não deu para carregar as resenhas"
        texto={erro}
        acao={
          <BotaoRetro onClick={lista.recarregar} sx={{ mt: 3 }}>
            Tentar de novo
          </BotaoRetro>
        }
      />
    );
  }

  if (lista.itens.length === 0) return <>{vazio}</>;

  return (
    <Stack sx={{ gap: 2 }}>
      {lista.itens.map((resenha) => (
        <CartaoResenha key={resenha.id} resenha={resenha} aoExcluir={lista.remover} />
      ))}

      {carregando && <CartaoResenhaCarregando />}
      <Box ref={sentinela} aria-hidden sx={{ height: 1 }} />

      <Stack sx={{ alignItems: "center", gap: 1, pt: 1 }}>
        {erro && (
          <Typography role="alert" sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.terracotaEscura, textAlign: "center" }}>
            {erro}
          </Typography>
        )}
        {temMais ? (
          <BotaoRetro variante="secundario" onClick={carregarMais} disabled={carregando}>
            {carregando ? "Carregando..." : erro ? "Tentar carregar de novo" : "Carregar mais"}
          </BotaoRetro>
        ) : (
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>Você chegou ao fim. ❦</Typography>
        )}
      </Stack>
    </Stack>
  );
}
