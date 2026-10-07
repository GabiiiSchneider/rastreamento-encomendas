import { Box, Stack } from "@mui/material";
import { cores } from "../lib/tema";
import { Lombada, type LivroLombada } from "./Lombada";

const livros: LivroLombada[] = [
  { titulo: "Dom Casmurro", autor: "Machado", cor: cores.terracota, corTexto: cores.papel, altura: 250, largura: 52 },
  { titulo: "Cem Anos de Solidão", autor: "Márquez", cor: cores.mostarda, corTexto: cores.tinta, altura: 280, largura: 58 },
  { titulo: "Mrs. Dalloway", autor: "Woolf", cor: cores.azul, corTexto: cores.tinta, altura: 220, largura: 42, ocultarNoCelular: true },
  { titulo: "Torto Arado", autor: "Vieira Jr.", cor: cores.rosa, corTexto: cores.tinta, altura: 265, largura: 50, inclinacao: -6 },
  { titulo: "1984", autor: "Orwell", cor: cores.papel, corTexto: cores.tinta, altura: 205, largura: 46 },
  { titulo: "Grande Sertão: Veredas", autor: "Rosa", cor: cores.terracotaEscura, corTexto: cores.papel, altura: 300, largura: 60 },
  { titulo: "A Hora da Estrela", autor: "Lispector", cor: cores.mostarda, corTexto: cores.tinta, altura: 230, largura: 40, ocultarNoCelular: true },
  { titulo: "Orgulho e Preconceito", autor: "Austen", cor: cores.azul, corTexto: cores.tinta, altura: 290, largura: 56 },
  { titulo: "Capitães da Areia", autor: "Amado", cor: cores.fundo, corTexto: cores.tinta, altura: 245, largura: 48, inclinacao: 5 },
  { titulo: "O Pequeno Príncipe", autor: "Saint-Exupéry", cor: cores.rosa, corTexto: cores.tinta, altura: 280, largura: 44, ocultarNoCelular: true },
  { titulo: "Amada", autor: "Morrison", cor: cores.terracota, corTexto: cores.papel, altura: 255, largura: 46, ocultarNoCelular: true },
  { titulo: "Vidas Secas", autor: "Ramos", cor: cores.mostarda, corTexto: cores.tinta, altura: 235, largura: 50, inclinacao: 7 },
];

export function EstanteAnimada() {
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Box sx={{ width: "max-content", mx: "auto", px: 2 }}>
        <Stack
          direction="row"
          sx={{ alignItems: "flex-end", gap: { xs: 0.5, md: 0.75 }, overflow: "hidden", pt: 5, px: 1 }}
        >
          {livros.map((livro, i) => (
            <Lombada key={livro.titulo} livro={livro} indice={i} />
          ))}
        </Stack>

        <Box
          sx={{
            height: { xs: 10, md: 14 },
            backgroundColor: cores.bordaEscura,
            borderTop: `3px solid ${cores.textoSuave}`,
            borderRadius: 1,
            boxShadow: `0 8px 0 ${cores.tintaClara}`,
          }}
        />
      </Box>
    </Box>
  );
}
