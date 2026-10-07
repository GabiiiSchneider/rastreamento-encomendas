import { Chip, Paper, Stack, Typography } from "@mui/material";
import { cores, fontes, retro } from "../../../lib/tema";

type Props = {
  bio: string;
  generoFavorito: string;
};

export function SobreUsuario({ bio, generoFavorito }: Props) {
  return (
    <Paper elevation={0} sx={{ backgroundColor: cores.fundo, border: retro.borda, borderRadius: 5, p: 3 }}>
      <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 28, color: cores.tinta, lineHeight: 1.1, mb: 1.5 }}>
        Sobre mim
      </Typography>
      <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.tinta, lineHeight: 1.6 }}>
        {bio}
      </Typography>
      <Stack direction="row" sx={{ alignItems: "center", gap: 1, mt: 2 }}>
        <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, fontWeight: 700, color: cores.textoSuave }}>
          Gênero favorito:
        </Typography>
        <Chip
          label={generoFavorito}
          sx={{
            backgroundColor: cores.mostarda,
            color: cores.tinta,
            border: `1.5px solid ${cores.tinta}`,
            fontFamily: fontes.corpo,
            fontWeight: 700,
          }}
        />
      </Stack>
    </Paper>
  );
}
