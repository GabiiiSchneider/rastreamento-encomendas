import { Alert, Snackbar } from "@mui/material";
import { cores, fontes, retro } from "../lib/tema";

export type Aviso = { tipo: "success" | "error"; mensagem: string };

type Props = {
  aviso: Aviso | null;
  aoFechar: () => void;
};

export function AvisoRetro({ aviso, aoFechar }: Props) {
  const erro = aviso?.tipo === "error";

  return (
    <Snackbar
      open={aviso !== null}
      autoHideDuration={erro ? 6000 : 4000}
      onClose={(_, motivo) => motivo !== "clickaway" && aoFechar()}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={aviso?.tipo ?? "success"}
        variant="filled"
        onClose={aoFechar}
        sx={{
          fontFamily: fontes.corpo,
          fontWeight: 500,
          borderRadius: 3,
          border: retro.borda,
          boxShadow: retro.sombraLeve,
          backgroundColor: erro ? cores.terracotaEscura : cores.tinta,
          color: cores.papel,
          "& .MuiAlert-icon": { color: erro ? cores.papel : cores.mostarda },
        }}
      >
        {aviso?.mensagem}
      </Alert>
    </Snackbar>
  );
}
