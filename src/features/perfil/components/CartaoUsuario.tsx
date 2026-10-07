import { Avatar, Box, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { cores, fontes, retro } from "../../../lib/tema";
import type { PerfilUsuario } from "../perfil.types";

type Props = {
  perfil: PerfilUsuario;
};

export function CartaoUsuario({ perfil }: Props) {
  const { estatisticas, meta } = perfil;
  const porcentagem = meta && meta.objetivo > 0 ? Math.min(100, Math.round((meta.lidos / meta.objetivo) * 100)) : 0;

  const numeros = [
    { label: "lidos no mês", valor: estatisticas.lidosNoMes, fundo: cores.rosa, texto: cores.tinta },
    { label: "total lidos", valor: estatisticas.totalLidos, fundo: cores.mostarda, texto: cores.tinta },
    { label: "quero ler", valor: estatisticas.queroLer, fundo: cores.azul, texto: cores.tinta },
    { label: "lendo agora", valor: estatisticas.lendo, fundo: cores.terracotaEscura, texto: cores.papel },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: cores.fundo,
        border: retro.borda,
        borderRadius: 6,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Stack sx={{ alignItems: "center", gap: 1, textAlign: "center" }}>
        <Avatar
          sx={{
            width: 112,
            height: 112,
            backgroundColor: cores.terracota,
            color: cores.papel,
            border: `5px solid ${cores.rosa}`,
            boxShadow: retro.sombraLeve,
            fontFamily: fontes.titulo,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 52,
          }}
        >
          {perfil.nome.charAt(0).toUpperCase()}
        </Avatar>
        <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 28, lineHeight: 1.1, color: cores.tinta }}>
          {perfil.nome}
        </Typography>
        {perfil.usuario && (
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.terracotaEscura, fontWeight: 500 }}>
            @{perfil.usuario}
          </Typography>
        )}
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        {numeros.map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              backgroundColor: cores.papel,
              border: retro.borda,
              boxShadow: retro.sombraLeve,
              borderRadius: 4,
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Chip
              label={item.label}
              size="small"
              sx={{
                backgroundColor: item.fundo,
                color: item.texto,
                fontFamily: fontes.corpo,
                fontWeight: 700,
                fontSize: 11,
                height: 22,
              }}
            />
            <Typography sx={{ fontFamily: fontes.titulo, fontSize: 32, fontWeight: 700, lineHeight: 1, color: cores.tinta }}>
              {item.valor}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={{ backgroundColor: cores.papel, border: retro.borda, borderRadius: 4, p: 2 }}>
        <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: cores.terracotaEscura }}>
          {meta ? `Meta de ${meta.ano}` : "Meta do ano"}
        </Typography>
        {meta ? (
          <>
            <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave, mb: 1.5 }}>
              {meta.lidos} de {meta.objetivo} livros lidos
            </Typography>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={porcentagem}
                sx={{
                  flexGrow: 1,
                  height: 12,
                  borderRadius: 50,
                  backgroundColor: cores.fundo,
                  border: `1px solid ${cores.tinta}`,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 50,
                    backgroundColor: cores.terracota,
                  },
                }}
              />
              <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, fontWeight: 700, color: cores.terracotaEscura }}>
                {porcentagem}%
              </Typography>
            </Stack>
          </>
        ) : (
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave }}>
            Nenhuma meta de leitura definida para este ano.
          </Typography>
        )}
      </Paper>
    </Paper>
  );
}
