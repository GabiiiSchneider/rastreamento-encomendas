import { useNavigate, useRouterState } from "@tanstack/react-router";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { cores, fontes } from "../../../lib/tema";
import { ITENS_NAVEGACAO, itemAtivo } from "../navegacao";

export const ALTURA_NAVEGACAO_INFERIOR = 64;

export function NavegacaoInferior() {
  const navigate = useNavigate();
  const caminho = useRouterState({ select: (estado) => estado.location.pathname });

  return (
    <Paper
      component="nav"
      aria-label="Navegação principal"
      elevation={0}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (tema) => tema.zIndex.appBar,
        borderTop: `3px solid ${cores.mostarda}`,
        borderRadius: 0,
        backgroundColor: cores.tinta,
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <BottomNavigation
        value={itemAtivo(caminho)}
        onChange={(_, rota) => navigate({ to: rota })}
        showLabels
        sx={{ height: ALTURA_NAVEGACAO_INFERIOR, backgroundColor: "transparent" }}
      >
        {ITENS_NAVEGACAO.map(({ rotulo, rota, Icone }) => (
          <BottomNavigationAction
            key={rota}
            value={rota}
            label={rotulo === "Minha estante" ? "Estante" : rotulo}
            icon={<Icone />}
            sx={{
              minWidth: 0,
              color: cores.textoClaro,
              "& .MuiBottomNavigationAction-label": { fontFamily: fontes.corpo, fontWeight: 700, fontSize: 12 },
              "&.Mui-selected": { color: cores.mostarda },
              "&.Mui-selected .MuiBottomNavigationAction-label": { fontSize: 12 },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
