import { Box } from "@mui/material";
import { cores } from "../lib/tema";
import { brilho, espiral } from "../lib/formas";

export function FundoY2K() {
  return (
    <Box
      component="svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <path d="M-40 120 C 120 40, 260 160, 220 300 C 180 440, 20 420, -40 380 Z" fill={cores.rosa} />
      <path d="M1200 -40 C 1260 80, 1420 60, 1480 140 L1480 -40 Z" fill={cores.roxo} />
      <path d="M1480 620 C 1300 560, 1180 700, 1240 820 C 1290 920, 1440 940, 1480 900 Z" fill={cores.limao} />
      <path d="M-40 760 C 80 700, 200 820, 160 940 L-40 940 Z" fill={cores.roxo} />

      <path d="M0 520 C 200 460, 320 620, 520 560 S 820 420, 980 520 S 1280 660, 1440 560" fill="none" stroke={cores.roxo} strokeWidth="4" opacity="0.45" />
      <path d="M0 610 C 240 570, 360 700, 600 650 S 900 520, 1100 620 S 1340 720, 1440 680" fill="none" stroke={cores.rosa} strokeWidth="7" opacity="0.7" />
      <path d="M260 0 C 300 120, 180 200, 260 320" fill="none" stroke={cores.roxo} strokeWidth="3" opacity="0.4" />

      <path d={brilho(120, 520, 26)} fill={cores.preto} />
      <path d={brilho(1340, 300, 34)} fill={cores.roxo} />
      <path d={brilho(1290, 470, 16)} fill={cores.preto} />
      <path d={brilho(380, 820, 22)} fill={cores.roxo} />
      <path d={brilho(1060, 80, 18)} fill={cores.preto} />
      <path d={espiral(1360, 160, 34, 3)} fill="none" stroke={cores.preto} strokeWidth="3" strokeLinecap="round" />
      <path d={espiral(80, 640, 28, 3)} fill="none" stroke={cores.roxo} strokeWidth="3" strokeLinecap="round" />
    </Box>
  );
}