import { useEffect, useState } from "react";
import { Skeleton, Stack, Typography } from "@mui/material";
import { PainelLateral } from "../../../components/PainelLateral";
import { cores, fontes } from "../../../lib/tema";
import { sugestoesParaSeguir } from "../social.functions";
import type { Leitor } from "../social.types";
import { CartaoLeitor } from "./CartaoLeitor";

type Props = {
  limite?: number;
  titulo?: string;
};

type Estado = { tipo: "carregando" } | { tipo: "erro" } | { tipo: "pronto"; leitores: Leitor[] };

export function QuemSeguir({ limite = 4, titulo = "Quem seguir" }: Props) {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  useEffect(() => {
    let cancelado = false;
    sugestoesParaSeguir({ data: { limite } })
      .then((leitores) => !cancelado && setEstado({ tipo: "pronto", leitores }))
      .catch(() => !cancelado && setEstado({ tipo: "erro" }));
    return () => {
      cancelado = true;
    };
  }, [limite]);

  return (
    <PainelLateral titulo={titulo}>
      {estado.tipo === "carregando" && (
        <Stack sx={{ gap: 2 }} aria-busy="true" aria-label="Carregando sugestões">
          {Array.from({ length: 3 }, (_, i) => (
            <Stack key={i} direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
              <Skeleton variant="circular" width={44} height={44} />
              <Skeleton variant="text" sx={{ flex: 1 }} />
            </Stack>
          ))}
        </Stack>
      )}
      {estado.tipo === "erro" && (
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>
          Não deu para carregar as sugestões agora.
        </Typography>
      )}
      {estado.tipo === "pronto" && estado.leitores.length === 0 && (
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>
          Você já segue todos os leitores por aqui. Quando chegar gente nova, ela aparece nesta lista.
        </Typography>
      )}
      {estado.tipo === "pronto" && estado.leitores.length > 0 && (
        <Stack sx={{ gap: 2 }}>
          {estado.leitores.map((leitor) => (
            <CartaoLeitor key={leitor.id} leitor={leitor} />
          ))}
        </Stack>
      )}
    </PainelLateral>
  );
}
