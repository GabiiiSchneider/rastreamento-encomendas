import { AppBar, Toolbar, Typography, Stack, Avatar, Button, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { cores, fontes } from "../lib/tema";

const menu = [
  { label: "Início", rota: "/home" },
  { label: "Adicionar livros", rota: "/livros/buscar" },
] as const;

export function Header() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ backgroundColor: cores.tinta, borderBottom: `3px solid ${cores.mostarda}` }}
    >
      <Toolbar sx={{ gap: 4, py: 1 }}>
        <Typography
          onClick={() => navigate({ to: "/home" })}
          sx={{
            fontFamily: fontes.titulo,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: { xs: 28, md: 34 },
            lineHeight: 1,
            color: cores.papel,
            cursor: "pointer",
          }}
        >
          Estante.
        </Typography>

        {/* menu */}
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
          {menu.map((item) => (
            <Button
              key={item.rota}
              onClick={() => navigate({ to: item.rota })}
              sx={{
                color: cores.papel,
                textTransform: "none",
                fontFamily: fontes.corpo,
                fontWeight: 500,
                "&:hover": { color: cores.mostarda, backgroundColor: "transparent" },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        {/* usuário */}
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Tooltip title="Meu perfil">
            <IconButton onClick={() => navigate({ to: "/perfil" })} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  backgroundColor: cores.terracota,
                  color: cores.papel,
                  border: `2px solid ${cores.mostarda}`,
                  fontFamily: fontes.titulo,
                  fontWeight: 700,
                }}
              >
                G
              </Avatar>
            </IconButton>
          </Tooltip>
          <Button
            onClick={() => navigate({ to: "/login" })}
            sx={{
              borderRadius: 3,
              px: 3,
              border: `2px solid ${cores.rosa}`,
              color: cores.rosa,
              textTransform: "none",
              fontFamily: fontes.corpo,
              fontWeight: 700,
              "&:hover": { backgroundColor: cores.rosa, color: cores.tinta },
            }}
          >
            Sair
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
