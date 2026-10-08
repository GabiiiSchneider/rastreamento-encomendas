import { Box, Pagination, Stack, Typography } from "@mui/material";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { cores, fontes, retro } from "../../../lib/tema";
import { CartaoLivroCarregando } from "./CartaoLivroBusca";
import { gradeLivros } from "./GradeLivros";

type Props = {
  pagina: number;
  totalPaginas: number;
  temMais: boolean;
  carregandoMais: boolean;
  erroMais: string | null;
  aoMudarPagina: (pagina: number) => void;
  aoCarregarMais: () => void;
};

// números de página a partir do tablet; "Carregar mais" no celular
export function PaginacaoResponsiva({ pagina, totalPaginas, temMais, carregandoMais, erroMais, aoMudarPagina, aoCarregarMais }: Props) {
  return (
    <>
      {totalPaginas > 1 && (
        <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "center", pt: 1 }}>
          <Pagination
            count={totalPaginas}
            page={Math.min(pagina, totalPaginas)}
            onChange={(_, novaPagina) => aoMudarPagina(novaPagina)}
            shape="rounded"
            siblingCount={1}
            sx={{
              "& .MuiPagination-ul": { gap: 1 },
              "& .MuiPaginationItem-root": {
                fontFamily: fontes.corpo,
                fontWeight: 700,
                color: cores.tinta,
                backgroundColor: cores.papel,
                border: retro.borda,
                borderRadius: 2,
                minWidth: 40,
                height: 40,
                "&:hover": { backgroundColor: cores.fundo },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: cores.mostarda,
                boxShadow: retro.sombraLeve,
                "&:hover": { backgroundColor: cores.mostardaEscura },
              },
              "& .MuiPaginationItem-ellipsis": { border: "none", backgroundColor: "transparent" },
            }}
          />
        </Box>
      )}

      {carregandoMais && (
        <Box sx={{ ...gradeLivros, display: { xs: "grid", sm: "none" } }}>
          {Array.from({ length: 2 }, (_, i) => (
            <CartaoLivroCarregando key={i} />
          ))}
        </Box>
      )}

      <Stack sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 1.5, pt: 1 }}>
        {erroMais && (
          <Typography role="alert" sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.terracotaEscura, textAlign: "center" }}>
            {erroMais}
          </Typography>
        )}
        {temMais ? (
          <BotaoRetro onClick={aoCarregarMais} disabled={carregandoMais} sx={{ width: "100%" }}>
            {carregandoMais ? "Carregando..." : erroMais ? "Tentar carregar de novo" : "Carregar mais"}
          </BotaoRetro>
        ) : (
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>
            Você chegou ao fim da lista.
          </Typography>
        )}
      </Stack>
    </>
  );
}
