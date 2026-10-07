import type { FormEvent, ReactNode } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { cores, fontes, retro } from "../lib/tema";

type Props = {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
  acoes: ReactNode;
  // quando informado, o Dialog vira um <form> e o Enter envia
  aoEnviar?: (evento: FormEvent) => void;
};

export function DialogRetro({ aberto, aoFechar, titulo, children, acoes, aoEnviar }: Props) {
  return (
    <Dialog
      open={aberto}
      onClose={aoFechar}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            backgroundColor: cores.papel,
            border: retro.borda,
            boxShadow: retro.sombra,
            borderRadius: 6,
            m: 2,
            width: "calc(100% - 32px)",
          },
        },
        backdrop: { sx: { backgroundColor: "rgba(43, 30, 26, 0.45)" } },
      }}
    >
      <Box component={aoEnviar ? "form" : "div"} onSubmit={aoEnviar} noValidate={aoEnviar ? true : undefined}>
        <DialogTitle
          sx={{
            fontFamily: fontes.titulo,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: { xs: 28, md: 32 },
            color: cores.terracota,
            lineHeight: 1.1,
            pt: 3,
            px: { xs: 2.5, md: 3.5 },
          }}
        >
          {titulo}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2.5, md: 3.5 } }}>{children}</DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, md: 3.5 },
            pb: 3,
            pt: 1,
            gap: 1.5,
            flexDirection: { xs: "column-reverse", sm: "row" },
            "& > :not(style) ~ :not(style)": { ml: 0 },
            "& > *": { width: { xs: "100%", sm: "auto" } },
          }}
        >
          {acoes}
        </DialogActions>
      </Box>
    </Dialog>
  );
}
