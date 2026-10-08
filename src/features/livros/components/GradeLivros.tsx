import { Box } from "@mui/material";
import { CartaoLivroCarregando } from "./CartaoLivroBusca";

export const gradeLivros = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
  gap: { xs: 2, md: 3 },
};

export function GradeCarregando({ quantidade = 8 }: { quantidade?: number }) {
  return (
    <Box sx={gradeLivros} aria-busy="true" aria-label="Carregando livros">
      {Array.from({ length: quantidade }, (_, i) => (
        <CartaoLivroCarregando key={i} />
      ))}
    </Box>
  );
}
