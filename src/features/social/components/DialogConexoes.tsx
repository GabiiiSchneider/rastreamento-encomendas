import { useEffect, useState } from "react";
import { Skeleton, Stack, Typography } from "@mui/material";
import { DialogRetro } from "../../../components/DialogRetro";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { cores, fontes } from "../../../lib/tema";
import { listarConexoes } from "../social.functions";
import type { Leitor, TipoConexao } from "../social.types";
import { CartaoLeitor } from "./CartaoLeitor";

type Props = {
  username: string;
  tipo: TipoConexao | null;
  aoFechar: () => void;
};

type Estado = { tipo: "carregando" } | { tipo: "erro" } | { tipo: "pronto"; leitores: Leitor[] };

export function DialogConexoes({ username, tipo, aoFechar }: Props) {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  useEffect(() => {
    if (!tipo) return;
    let cancelado = false;
    setEstado({ tipo: "carregando" });
    listarConexoes({ data: { username, tipo } })
      .then((leitores) => !cancelado && setEstado({ tipo: "pronto", leitores }))
      .catch(() => !cancelado && setEstado({ tipo: "erro" }));
    return () => {
      cancelado = true;
    };
  }, [username, tipo]);

  const vazio = tipo === "seguidores" ? "Ninguém segue este leitor ainda." : "Este leitor ainda não segue ninguém.";

  return (
    <DialogRetro
      aberto={tipo !== null}
      aoFechar={aoFechar}
      titulo={tipo === "seguindo" ? "Seguindo" : "Seguidores"}
      acoes={
        <BotaoRetro variante="secundario" onClick={aoFechar}>
          Fechar
        </BotaoRetro>
      }
    >
      {estado.tipo === "carregando" && (
        <Stack sx={{ gap: 2, py: 1 }} aria-busy="true">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      )}
      {estado.tipo === "erro" && (
        <Typography sx={{ fontFamily: fontes.corpo, color: cores.terracotaEscura }}>Não deu para carregar a lista agora.</Typography>
      )}
      {estado.tipo === "pronto" &&
        (estado.leitores.length === 0 ? (
          <Typography sx={{ fontFamily: fontes.corpo, color: cores.textoSuave }}>{vazio}</Typography>
        ) : (
          <Stack sx={{ gap: 2, py: 1 }}>
            {estado.leitores.map((leitor) => (
              <CartaoLeitor key={leitor.id} leitor={leitor} />
            ))}
          </Stack>
        ))}
    </DialogRetro>
  );
}
