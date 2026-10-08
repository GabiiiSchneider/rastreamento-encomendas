import { Avatar } from "@mui/material";
import { cores, fontes } from "../lib/tema";

type Props = {
  nome: string;
  avatarUrl: string | null;
  tamanho?: number;
};
export function AvatarUsuario({ nome, avatarUrl, tamanho = 44 }: Props) {
  return (
    <Avatar
      src={avatarUrl ?? undefined}
      alt={avatarUrl ? `Foto de ${nome}` : undefined}
      sx={{
        width: tamanho,
        height: tamanho,
        backgroundColor: cores.terracota,
        color: cores.papel,
        border: `2px solid ${cores.tinta}`,
        fontFamily: fontes.titulo,
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: tamanho * 0.45,
        flexShrink: 0,
      }}
    >
      {nome.charAt(0).toUpperCase()}
    </Avatar>
  );
}
