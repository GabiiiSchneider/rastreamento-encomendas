import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { InputBase, Paper } from "@mui/material";
import { IconeLupa } from "../../../components/Icones";
import { cores, fontes, retro } from "../../../lib/tema";

type Props = {
  valorInicial?: string;
};

export function BarraPesquisa({ valorInicial = "" }: Props) {
  const navigate = useNavigate();
  const [texto, setTexto] = useState(valorInicial);

  useEffect(() => {
    setTexto(valorInicial);
  }, [valorInicial]);

  function pesquisar(evento: FormEvent) {
    evento.preventDefault();
    const termo = texto.trim();
    if (!termo) return;
    navigate({ to: "/buscar", search: { q: termo } });
  }

  return (
    <Paper
      component="form"
      role="search"
      onSubmit={pesquisar}
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        backgroundColor: cores.papel,
        border: retro.borda,
        boxShadow: retro.sombraLeve,
        borderRadius: 50,
        "&:focus-within": { boxShadow: `3px 3px 0 ${cores.terracota}` },
      }}
    >
      <IconeLupa sx={{ color: cores.textoSuave }} />
      <InputBase
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Livros, autores, leitores..."
        inputProps={{ "aria-label": "Pesquisar livros, autores, resenhas e leitores", enterKeyHint: "search" }}
        sx={{ flex: 1, minWidth: 0, fontFamily: fontes.corpo, fontSize: 15, color: cores.tinta, "& input::placeholder": { color: cores.textoSuave, opacity: 1 } }}
      />
    </Paper>
  );
}
