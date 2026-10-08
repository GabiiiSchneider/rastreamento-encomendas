import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { IconButton, Tooltip } from "@mui/material";
import { IconeLapis } from "../../components/Icones";
import { AvisoRetro, type Aviso } from "../../components/AvisoRetro";
import { cores, retro } from "../../lib/tema";
import { CartaoUsuario } from "../../features/perfil/components/CartaoUsuario";
import { CarrosselLivros } from "../../features/perfil/components/CarrosselLivros";
import { SobreUsuario } from "../../features/perfil/components/SobreUsuario";
import { DialogEditarPerfil } from "../../features/perfil/components/DialogEditarPerfil";
import { LayoutPerfil, PerfilNaoEncontrado, TituloPerfil } from "../../features/perfil/components/LayoutPerfil";
import { ResenhasDoLeitor, rolarAteResenhas } from "../../features/reviews/components/ResenhasDoLeitor";
import { MensagemEstado } from "../../features/livros/components/MensagemEstado";
import { listarMinhaEstante } from "../../features/livros/livros.functions";
import { obterMeuPerfil } from "../../features/perfil/perfil.functions";

export const Route = createFileRoute("/_autenticado/perfil")({
  loader: async () => {
    const [perfil, livrosLidos] = await Promise.all([
      obterMeuPerfil(),
      listarMinhaEstante({ data: { status: "READ" } }),
    ]);
    return { perfil, livrosLidos };
  },
  component: PerfilPage,
});

function PerfilPage() {
  const { perfil, livrosLidos } = Route.useLoaderData();
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  function atualizar() {
    return router.invalidate();
  }

  async function aoSalvarPerfil() {
    setEditando(false);
    await atualizar();
    setAviso({ tipo: "success", mensagem: "Perfil atualizado!" });
  }

  if (!perfil) return <PerfilNaoEncontrado texto="Não encontramos os dados deste usuário." />;

  return (
    <LayoutPerfil
      titulo={
        <>
          <TituloPerfil>Perfil</TituloPerfil>
          <Tooltip title="Editar perfil">
            <IconButton
              aria-label="Editar perfil"
              onClick={() => setEditando(true)}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: cores.papel,
                color: cores.tinta,
                border: retro.borda,
                boxShadow: retro.sombraLeve,
                transition: "transform 0.15s, box-shadow 0.15s",
                "&:hover": { backgroundColor: cores.mostarda, transform: "translate(-1px, -1px)", boxShadow: `4px 4px 0 ${cores.tinta}` },
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            >
              <IconeLapis sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </>
      }
      subtitulo="Suas leituras, metas e um pouquinho sobre você."
      principal={
        <>
          <CarrosselLivros livros={livrosLidos} />
          <SobreUsuario bio={perfil.bio} generoFavorito={perfil.generoFavorito} />
          {perfil.usuario ? (
            <ResenhasDoLeitor
              username={perfil.usuario}
              titulo="Minhas resenhas"
              vazio={{ titulo: "Você ainda não escreveu resenhas", texto: "Conte o que achou dos seus livros no feed, em “Escrever resenha”." }}
            />
          ) : (
            <MensagemEstado
              titulo="Minhas resenhas"
              texto="Escolha um nome de usuário em “Editar perfil” para ter uma página pública com as suas resenhas."
            />
          )}
        </>
      }
      lateral={<CartaoUsuario perfil={perfil} aoAtualizar={atualizar} aoAvisar={setAviso} aoVerResenhas={rolarAteResenhas} />}
      depois={
        <>
          <DialogEditarPerfil
            // remonta com os dados novos depois de salvar
            key={[perfil.nome, perfil.usuario, perfil.bio, perfil.generoFavorito].join("|")}
            aberto={editando}
            perfil={perfil}
            aoFechar={() => setEditando(false)}
            aoSalvar={aoSalvarPerfil}
          />
          <AvisoRetro aviso={aviso} aoFechar={() => setAviso(null)} />
        </>
      }
    />
  );
}
