import { useRouterState } from "@tanstack/react-router";
import { Paper, Stack } from "@mui/material";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { LinkRouter } from "../../../components/LinkRouter";
import { IconeLapis } from "../../../components/Icones";
import { cores, fontes, retro } from "../../../lib/tema";
import { ITENS_NAVEGACAO, itemAtivo } from "../navegacao";

type Props = {
  aoEscrever: () => void;
};

export function MenuLateral({ aoEscrever }: Props) {
  const caminho = useRouterState({ select: (estado) => estado.location.pathname });
  const ativo = itemAtivo(caminho);

  return (
    <Stack component="nav" aria-label="Navegação principal" sx={{ gap: 2.5 }}>
      <Paper elevation={0} sx={{ backgroundColor: cores.papel, border: retro.borda, boxShadow: retro.sombraLeve, borderRadius: 5, p: 1.5 }}>
        <Stack component="ul" sx={{ listStyle: "none", m: 0, p: 0, gap: 0.5 }}>
          {ITENS_NAVEGACAO.map(({ rotulo, rota, Icone }) => {
            const selecionado = ativo === rota;
            return (
              <li key={rota}>
                <LinkRouter
                  to={rota}
                  underline="none"
                  aria-current={selecionado ? "page" : undefined}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1.1,
                    borderRadius: 3,
                    fontFamily: fontes.corpo,
                    fontWeight: selecionado ? 700 : 500,
                    fontSize: 16,
                    color: cores.tinta,
                    backgroundColor: selecionado ? cores.mostarda : "transparent",
                    border: selecionado ? `2px solid ${cores.tinta}` : "2px solid transparent",
                    "&:hover": { backgroundColor: selecionado ? cores.mostarda : cores.fundo },
                    "&:focus-visible": { outline: `3px solid ${cores.terracota}`, outlineOffset: 2 },
                  }}
                >
                  <Icone sx={{ fontSize: 22 }} />
                  {rotulo}
                </LinkRouter>
              </li>
            );
          })}
        </Stack>
      </Paper>

      <BotaoRetro onClick={aoEscrever} startIcon={<IconeLapis />} sx={{ width: "100%", py: 1.5, fontSize: 17 }}>
        Escrever resenha
      </BotaoRetro>
    </Stack>
  );
}
