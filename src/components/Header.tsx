import { AppBar, Toolbar, Typography, Stack, Avatar, Button, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate, useRouteContext, useRouter } from "@tanstack/react-router";
import { cores, fontes } from "../lib/tema";
import { logoutUsuario } from "../features/user/auth.functions";
import { NavegacaoInferior } from "../features/feed/components/NavegacaoInferior";

const menu = [
  { label: "Início", rota: "/home" },
  { label: "Buscar", rota: "/buscar" },
  { label: "Adicionar livros", rota: "/livros/buscar" },
] as const;

export function Header() {
  const navigate = useNavigate();
  const router = useRouter();
  const { usuario } = useRouteContext({ from: "__root__" });
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    try {
      await logoutUsuario();
      await router.invalidate();
      await navigate({ to: "/login" });
    } finally {
      setSaindo(false);
    }
  }

  return (
    <>
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
          <Stack direction="row" spacing={1} sx={{ flexGrow: 1, "& > *": { display: { xs: "none", md: "inline-flex" } } }}>
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
                  src={usuario?.avatarUrl ?? undefined}
                  alt={usuario ? `Foto de ${usuario.nome}` : undefined}
                  sx={{
                    backgroundColor: cores.terracota,
                    color: cores.papel,
                    border: `2px solid ${cores.mostarda}`,
                    fontFamily: fontes.titulo,
                    fontWeight: 700,
                  }}
                >
                  {usuario?.nome.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Button
              onClick={sair}
              disabled={saindo}
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
      <NavegacaoInferior />
    </>
  );
}
