import { Box } from "@mui/material";
import { cores } from "../lib/tema";

// formas orgânicas suaves, como manchas de tinta em papel antigo
export function FundoPapel() {
  return (
    <Box
      component="svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <path d="M-60 140 C 80 40, 280 120, 260 280 C 240 430, 60 460, -60 400 Z" fill={cores.rosa} opacity="0.55" />
      <path d="M1180 -60 C 1240 70, 1400 90, 1500 40 L1500 -60 Z" fill={cores.azul} opacity="0.7" />
      <path d="M1500 560 C 1330 520, 1180 640, 1220 780 C 1260 920, 1430 960, 1500 920 Z" fill={cores.mostarda} opacity="0.55" />
      <path d="M-60 740 C 70 680, 230 760, 210 900 L-60 920 Z" fill={cores.terracota} opacity="0.3" />
      <path d="M1040 300 C 1110 250, 1210 290, 1200 360 C 1190 430, 1090 440, 1050 400 C 1010 360, 990 340, 1040 300 Z" fill={cores.rosa} opacity="0.35" />
      <path d="M420 760 C 470 720, 560 740, 560 800 C 560 860, 470 880, 430 850 C 390 820, 380 790, 420 760 Z" fill={cores.azul} opacity="0.45" />

      <path d="M0 540 C 220 480, 360 620, 560 570 S 860 440, 1020 530 S 1300 660, 1440 580" fill="none" stroke={cores.tinta} strokeWidth="1.5" opacity="0.15" />
      <path d="M0 620 C 240 590, 380 700, 620 660 S 920 540, 1120 630 S 1360 720, 1440 690" fill="none" stroke={cores.terracota} strokeWidth="2" opacity="0.25" />
    </Box>
  );
}
