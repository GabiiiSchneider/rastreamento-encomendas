import { Box, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { fontes } from "../lib/tema";

export type LivroLombada = {
  titulo: string;
  autor: string;
  cor: string;
  corTexto: string;
  altura: number;
  largura: number;
  inclinacao?: number;
  ocultarNoCelular?: boolean;
};

type Props = {
  livro: LivroLombada;
  indice: number;
};

const entrar = keyframes`
  from { transform: translateY(110%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const respirar = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const escala = { xs: 0.6, sm: 0.8, md: 1 };

function escalar(valor: number) {
  return {
    xs: Math.round(valor * escala.xs),
    sm: Math.round(valor * escala.sm),
    md: valor,
  };
}

const semMovimento = { "@media (prefers-reduced-motion: reduce)": { animation: "none" } };

export function Lombada({ livro, indice }: Props) {
  const inclinacao = livro.inclinacao ?? 0;
  const atrasoEntrada = 0.25 + indice * 0.09;
  const duracaoEntrada = 0.7;
  const atrasoRespirar = atrasoEntrada + duracaoEntrada + (indice % 4) * 0.4;
  const duracaoRespirar = 3.5 + (indice % 3) * 0.7;
  const deslocamento = Math.round(livro.altura * Math.sin((Math.abs(inclinacao) * Math.PI) / 180));
  const tamanhoTitulo = livro.largura >= 56 ? 17 : livro.largura >= 46 ? 15 : 13;
  const transformBase = `rotate(${inclinacao}deg)`;

  return (
    <Box
      sx={{
        display: livro.ocultarNoCelular ? { xs: "none", sm: "block" } : "block",
        flexShrink: 0,
        ml: inclinacao < 0 ? escalar(deslocamento) : 0,
        mr: inclinacao > 0 ? escalar(deslocamento) : 0,
        animation: `${entrar} ${duracaoEntrada}s cubic-bezier(0.22, 1, 0.36, 1) ${atrasoEntrada}s both`,
        ...semMovimento,
      }}
    >
      <Box
        sx={{
          animation: `${respirar} ${duracaoRespirar}s ease-in-out ${atrasoRespirar}s infinite`,
          ...semMovimento,
        }}
      >
        <Stack
          sx={{
            height: escalar(livro.altura),
            width: escalar(livro.largura),
            backgroundColor: livro.cor,
            color: livro.corTexto,
            borderRadius: "4px 4px 2px 2px",
            alignItems: "center",
            justifyContent: "space-between",
            py: { xs: 1, md: 1.5 },
            transform: transformBase,
            transformOrigin: inclinacao > 0 ? "bottom right" : "bottom left",
            transition: "transform 0.3s ease",
            cursor: "default",
            "&:hover": { transform: `${transformBase} translateY(-22px)` },
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        >
          <Faixa />
          <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", py: 1 }}>
            <Typography
              sx={{
                writingMode: "vertical-rl",
                fontFamily: fontes.titulo,
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: escalar(tamanhoTitulo),
                lineHeight: 1,
                whiteSpace: "nowrap",
                color: livro.corTexto,
              }}
            >
              {livro.titulo}
            </Typography>
          </Box>
          <Typography
            sx={{
              writingMode: "vertical-rl",
              fontFamily: fontes.corpo,
              fontWeight: 700,
              fontSize: escalar(9),
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: livro.corTexto,
              mb: 1,
            }}
          >
            {livro.autor}
          </Typography>
          <Faixa />
        </Stack>
      </Box>
    </Box>
  );
}

function Faixa() {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 4, md: 6 },
        borderTop: "2px solid currentColor",
        borderBottom: "2px solid currentColor",
        opacity: 0.55,
        flexShrink: 0,
      }}
    />
  );
}
