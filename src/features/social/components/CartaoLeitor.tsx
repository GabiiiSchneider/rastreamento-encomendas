import { Box, Stack, Typography } from "@mui/material";
import { LinkRouter } from "../../../components/LinkRouter";
import { AvatarUsuario } from "../../../components/AvatarUsuario";
import { cores, fontes } from "../../../lib/tema";
import type { Leitor } from "../social.types";
import { BotaoSeguir } from "./BotaoSeguir";

type Props = {
  leitor: Leitor;
  mostrarBio?: boolean;
};

export function CartaoLeitor({ leitor, mostrarBio = false }: Props) {
  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <LinkRouter to="/u/$username" params={{ username: leitor.username }} underline="none" aria-label={`Perfil de ${leitor.nome}`} sx={{ borderRadius: "50%" }}>
        <AvatarUsuario nome={leitor.nome} avatarUrl={leitor.avatarUrl} />
      </LinkRouter>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <LinkRouter
          to="/u/$username"
          params={{ username: leitor.username }}
          underline="hover"
          sx={{ display: "block", fontFamily: fontes.corpo, fontWeight: 700, fontSize: 15, color: cores.tinta, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {leitor.nome}
        </LinkRouter>
        <Typography noWrap sx={{ fontFamily: fontes.corpo, fontSize: 13, color: cores.textoSuave }}>
          @{leitor.username} · {leitor.resenhas} {leitor.resenhas === 1 ? "resenha" : "resenhas"}
        </Typography>
        {mostrarBio && leitor.bio && (
          <Typography
            sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.tinta, mt: 0.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {leitor.bio}
          </Typography>
        )}
      </Box>
      {!leitor.ehVoce && <BotaoSeguir usuarioId={leitor.id} nome={leitor.nome} seguindoInicial={leitor.euSigo} />}
    </Stack>
  );
}
