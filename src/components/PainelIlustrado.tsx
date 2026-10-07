import { Box } from "@mui/material";
import { cores } from "../lib/tema";

type PainelIlustradoProps = {
  src: string;
  alt: string;
};

function Decoracoes() {
  return (
    <Box
      component="svg"
      viewBox="0 0 500 600"
      preserveAspectRatio="xMidYMid slice"
      sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <path d="M380 -20 C 460 -10, 530 60, 510 140 C 490 200, 410 180, 390 120 C 375 70, 330 -30, 380 -20 Z" fill={cores.mostarda} opacity="0.8" />
      <path d="M-20 470 C 40 430, 110 480, 90 560 C 80 610, 0 620, -20 600 Z" fill={cores.azul} opacity="0.85" />
      <path d="M30 60 C 80 30, 150 60, 140 110 C 130 160, 60 160, 40 130 C 20 100, 0 80, 30 60 Z" fill={cores.papel} opacity="0.5" />

      <path d="M0 160 C 80 120, 140 220, 230 180 S 380 90, 500 150" fill="none" stroke={cores.tinta} strokeWidth="1.5" opacity="0.25" />
      <path d="M0 520 C 120 490, 200 560, 320 530 S 450 470, 500 500" fill="none" stroke={cores.papel} strokeWidth="4" opacity="0.6" />
    </Box>
  );
}

export function PainelIlustrado({ src, alt }: PainelIlustradoProps) {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: cores.rosa,
        borderRadius: 6,
        p: 3,
      }}
    >
      <Decoracoes />
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ position: "relative", width: "100%", maxWidth: 440, height: "auto", objectFit: "contain" }}
      />
    </Box>
  );
}
