import { useState } from "react";
import { Button } from "@mui/material";
import { cores, fontes, retro } from "../../../lib/tema";
import { deixarDeSeguirLeitor, seguirLeitor } from "../social.functions";

type Props = {
  usuarioId: string;
  nome: string;
  seguindoInicial: boolean;
  tamanho?: "pequeno" | "normal";
  aoMudar?: (seguindo: boolean, seguidores: number) => void;
};

export function BotaoSeguir({ usuarioId, nome, seguindoInicial, tamanho = "pequeno", aoMudar }: Props) {
  const [seguindo, setSeguindo] = useState(seguindoInicial);
  const [enviando, setEnviando] = useState(false);
  const [emFoco, setEmFoco] = useState(false);
  const [erro, setErro] = useState(false);

  async function alternar() {
    const seguir = !seguindo;
    setSeguindo(seguir);
    setEnviando(true);
    setErro(false);
    try {
      const resultado = seguir
        ? await seguirLeitor({ data: { usuarioId } })
        : await deixarDeSeguirLeitor({ data: { usuarioId } });
      if (!resultado.ok) throw new Error(resultado.mensagem);
      setSeguindo(resultado.seguindo);
      aoMudar?.(resultado.seguindo, resultado.seguidores);
    } catch {
      setSeguindo(!seguir);
      setErro(true);
    } finally {
      setEnviando(false);
    }
  }

  const rotulo = erro ? "Tentar de novo" : seguindo ? (emFoco ? "Deixar de seguir" : "Seguindo") : "Seguir";

  return (
    <Button
      onClick={alternar}
      disabled={enviando}
      onMouseEnter={() => setEmFoco(true)}
      onMouseLeave={() => setEmFoco(false)}
      onFocus={() => setEmFoco(true)}
      onBlur={() => setEmFoco(false)}
      aria-pressed={seguindo}
      aria-label={seguindo ? `Deixar de seguir ${nome}` : `Seguir ${nome}`}
      sx={{
        flexShrink: 0,
        minWidth: tamanho === "pequeno" ? 92 : 140,
        px: tamanho === "pequeno" ? 1.75 : 3,
        py: tamanho === "pequeno" ? 0.5 : 1,
        borderRadius: 3,
        border: retro.borda,
        boxShadow: retro.sombraLeve,
        fontFamily: fontes.corpo,
        fontWeight: 700,
        fontSize: tamanho === "pequeno" ? 13 : 15,
        textTransform: "none",
        whiteSpace: "nowrap",
        backgroundColor: seguindo ? cores.papel : cores.mostarda,
        color: cores.tinta,
        transition: "transform 0.15s, box-shadow 0.15s, background-color 0.15s",
        "&:hover": {
          backgroundColor: seguindo ? cores.rosa : cores.mostardaEscura,
          transform: "translate(-1px, -1px)",
          boxShadow: `4px 4px 0 ${cores.tinta}`,
        },
        "&.Mui-disabled": { color: cores.tinta, border: retro.borda, opacity: 0.7 },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      {rotulo}
    </Button>
  );
}
