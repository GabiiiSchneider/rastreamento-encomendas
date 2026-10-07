import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { Header } from "../components/Header";
import { FundoPapel } from "../components/FundoPapel";
import { IconeLapis } from "../components/Icones";
import { AvisoRetro, type Aviso } from "../components/AvisoRetro";
import { fontes, cores, retro } from "../lib/tema";
import { CartaoUsuario } from "../features/perfil/components/CartaoUsuario";
import { CarrosselLivros } from "../features/perfil/components/CarrosselLivros";
import { SobreUsuario } from "../features/perfil/components/SobreUsuario";
import { DialogEditarPerfil } from "../features/perfil/components/DialogEditarPerfil";
import { listarMinhaEstante } from "../features/livros/livros.functions";
import { obterMeuPerfil } from "../features/perfil/perfil.functions";

export const Route = createFileRoute("/perfil")({
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

  // recarrega o perfil e o Header (o loader do __root traz o avatar)
  function atualizar() {
    return router.invalidate();
  }

  async function aoSalvarPerfil() {
    setEditando(false);
    await atualizar();
    setAviso({ tipo: "success", mensagem: "Perfil atualizado!" });
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: cores.fundo,
          px: 2,
          py: { xs: 3, md: 6 },
        }}
      >
        <FundoPapel />

        <Paper
          elevation={0}
          sx={{
            position: "relative",
            mx: "auto",
            width: "100%",
            maxWidth: 1200,
            backgroundColor: cores.papel,
            border: retro.borda,
            boxShadow: retro.sombra,
            borderRadius: 8,
            p: { xs: 2.5, md: 4 },
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: perfil ? "minmax(0, 1fr) 320px" : "minmax(0, 1fr)" },
            gap: 4,
          }}
        >
          {perfil ? (
            <>
              <Stack sx={{ gap: 4, order: { xs: 2, md: 1 }, minWidth: 0 }}>
                <Box>
                  <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
                    <Typography
                      component="h1"
                      sx={{
                        fontFamily: fontes.titulo,
                        fontStyle: "italic",
                        fontWeight: 600,
                        fontSize: { xs: 38, md: 48 },
                        color: cores.terracota,
                        lineHeight: 1,
                      }}
                    >
                      Perfil
                    </Typography>
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
                  </Stack>
                  <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.textoSuave, mt: 1 }}>
                    Suas leituras, metas e um pouquinho sobre você.
                  </Typography>
                </Box>

                <CarrosselLivros livros={livrosLidos} />
                <SobreUsuario bio={perfil.bio} generoFavorito={perfil.generoFavorito} />
              </Stack>

              <Box sx={{ order: { xs: 1, md: 2 } }}>
                <CartaoUsuario perfil={perfil} aoAtualizar={atualizar} aoAvisar={setAviso} />
              </Box>

              <DialogEditarPerfil
                // remonta com os dados novos depois de salvar
                key={[perfil.nome, perfil.usuario, perfil.bio, perfil.generoFavorito].join("|")}
                aberto={editando}
                perfil={perfil}
                aoFechar={() => setEditando(false)}
                aoSalvar={aoSalvarPerfil}
              />
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ fontFamily: fontes.titulo, fontStyle: "italic", fontWeight: 600, fontSize: 28, color: cores.tinta }}>
                Perfil não encontrado
              </Typography>
              <Typography sx={{ fontFamily: fontes.corpo, fontSize: 16, color: cores.textoSuave, mt: 1 }}>
                Não encontramos os dados deste usuário.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <AvisoRetro aviso={aviso} aoFechar={() => setAviso(null)} />
    </>
  );
}
