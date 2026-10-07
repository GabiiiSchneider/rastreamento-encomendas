import { useRef, useState, type ChangeEvent } from "react";
import { Avatar, Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DialogRetro } from "../../../components/DialogRetro";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { IconeLapis } from "../../../components/Icones";
import type { Aviso } from "../../../components/AvisoRetro";
import { cores, fontes, retro } from "../../../lib/tema";
import { salvarAvatar } from "../perfil.functions";
import { TAMANHO_MAXIMO_AVATAR } from "../perfil.validacao";

type Props = {
  nome: string;
  avatarUrl: string | null;
  aoSalvar: () => void;
  aoAvisar: (aviso: Aviso) => void;
};

const LADO_FOTO = 256;
const QUALIDADE_JPEG = 0.85;
const TAMANHO_MAXIMO_ARQUIVO = 20 * 1024 * 1024;

function carregarImagem(url: string) {
  return new Promise<HTMLImageElement>((resolver, rejeitar) => {
    const imagem = new Image();
    imagem.onload = () => resolver(imagem);
    imagem.onerror = () => rejeitar(new Error("imagem inválida"));
    imagem.src = url;
  });
}

// recorta o centro da imagem num quadrado, reduz para 256x256 e converte para JPEG
async function prepararFoto(arquivo: File): Promise<string> {
  const url = URL.createObjectURL(arquivo);
  try {
    const imagem = await carregarImagem(url);
    const lado = Math.min(imagem.naturalWidth, imagem.naturalHeight);
    const x = (imagem.naturalWidth - lado) / 2;
    const y = (imagem.naturalHeight - lado) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = LADO_FOTO;
    canvas.height = LADO_FOTO;
    const contexto = canvas.getContext("2d");
    if (!contexto) throw new Error("canvas indisponível");

    // JPEG não tem transparência: PNGs transparentes ficam com fundo de papel em vez de preto
    contexto.fillStyle = cores.papel;
    contexto.fillRect(0, 0, LADO_FOTO, LADO_FOTO);
    contexto.imageSmoothingQuality = "high";
    contexto.drawImage(imagem, x, y, lado, lado, 0, 0, LADO_FOTO, LADO_FOTO);

    return canvas.toDataURL("image/jpeg", QUALIDADE_JPEG);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function AvatarEditavel({ nome, avatarUrl, aoSalvar, aoAvisar }: Props) {
  const entradaRef = useRef<HTMLInputElement>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function escolherArquivo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    // limpa o input para que escolher o mesmo arquivo de novo também dispare o onChange
    evento.target.value = "";
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      aoAvisar({ tipo: "error", mensagem: "Esse arquivo não é uma imagem. Escolha uma foto (JPG, PNG, WEBP...)." });
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO_ARQUIVO) {
      aoAvisar({ tipo: "error", mensagem: "Essa imagem é grande demais. Escolha uma com menos de 20 MB." });
      return;
    }

    try {
      const foto = await prepararFoto(arquivo);
      if (foto.length > TAMANHO_MAXIMO_AVATAR) throw new Error("imagem grande demais");
      setPrevia(foto);
    } catch {
      aoAvisar({ tipo: "error", mensagem: "Não conseguimos abrir essa imagem. Tente outra foto." });
    }
  }

  function cancelar() {
    if (salvando) return;
    setPrevia(null);
  }

  async function salvar() {
    if (!previa) return;
    setSalvando(true);
    try {
      const resultado = await salvarAvatar({ data: { avatarUrl: previa } });
      if (resultado.ok) {
        setPrevia(null);
        aoSalvar();
        aoAvisar({ tipo: "success", mensagem: "Foto de perfil atualizada!" });
      } else {
        aoAvisar({ tipo: "error", mensagem: resultado.mensagem });
      }
    } catch (erro) {
      const detalhe = erro instanceof Error && erro.message ? ` (${erro.message})` : "";
      aoAvisar({ tipo: "error", mensagem: `Não foi possível salvar a foto${detalhe}. Tente novamente.` });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      <FotoPerfil nome={nome} src={avatarUrl} />

      <Tooltip title="Trocar foto">
        <IconButton
          aria-label="Trocar foto"
          onClick={() => entradaRef.current?.click()}
          sx={{
            position: "absolute",
            right: 0,
            bottom: 2,
            width: 36,
            height: 36,
            backgroundColor: cores.mostarda,
            color: cores.tinta,
            border: retro.borda,
            boxShadow: `2px 2px 0 ${cores.tinta}`,
            "&:hover": { backgroundColor: cores.mostardaEscura },
          }}
        >
          <IconeLapis sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Box component="input" ref={entradaRef} type="file" accept="image/*" onChange={escolherArquivo} sx={{ display: "none" }} />

      <DialogRetro
        aberto={previa !== null}
        aoFechar={cancelar}
        titulo="Nova foto de perfil"
        acoes={
          <>
            <BotaoRetro variante="secundario" onClick={cancelar} disabled={salvando}>
              Cancelar
            </BotaoRetro>
            <BotaoRetro onClick={salvar} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </BotaoRetro>
          </>
        }
      >
        <Stack sx={{ alignItems: "center", gap: 2, py: 1 }}>
          <FotoPerfil nome={nome} src={previa} tamanho={160} />
          <Typography sx={{ fontFamily: fontes.corpo, fontSize: 14, color: cores.textoSuave, textAlign: "center" }}>
            É assim que sua foto vai aparecer no perfil.
          </Typography>
        </Stack>
      </DialogRetro>
    </Box>
  );
}

function FotoPerfil({ nome, src, tamanho = 112 }: { nome: string; src: string | null; tamanho?: number }) {
  return (
    <Avatar
      src={src ?? undefined}
      alt={`Foto de ${nome}`}
      sx={{
        width: tamanho,
        height: tamanho,
        backgroundColor: cores.terracota,
        color: cores.papel,
        border: `5px solid ${cores.rosa}`,
        boxShadow: retro.sombraLeve,
        fontFamily: fontes.titulo,
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: tamanho * 0.46,
      }}
    >
      {nome.charAt(0).toUpperCase()}
    </Avatar>
  );
}
