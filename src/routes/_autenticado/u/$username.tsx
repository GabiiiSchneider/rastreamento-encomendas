import { useState } from "react";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { CartaoUsuario } from "../../../features/perfil/components/CartaoUsuario";
import { CarrosselLivros } from "../../../features/perfil/components/CarrosselLivros";
import { SobreUsuario } from "../../../features/perfil/components/SobreUsuario";
import { LayoutPerfil, PerfilNaoEncontrado } from "../../../features/perfil/components/LayoutPerfil";
import { ResenhasDoLeitor, rolarAteResenhas } from "../../../features/reviews/components/ResenhasDoLeitor";
import { BotaoSeguir } from "../../../features/social/components/BotaoSeguir";
import { obterPerfilPublico } from "../../../features/perfil/perfil.functions";
import type { PerfilPublico } from "../../../features/perfil/perfil.types";
import type { LivroNaEstante } from "../../../features/livros/livros.types";

export const Route = createFileRoute("/_autenticado/u/$username")({
  beforeLoad: ({ context, params }) => {
    if (context.usuario.username && context.usuario.username === params.username.toLowerCase()) {
      throw redirect({ to: "/perfil" });
    }
  },
  loader: async ({ params }) => {
    const dados = await obterPerfilPublico({ data: { username: params.username } });
    if (!dados) throw notFound();
    return dados;
  },
  component: PerfilPublicoPage,
  notFoundComponent: () => <PerfilNaoEncontrado texto="Não existe nenhum leitor com esse nome de usuário." />,
});

function PerfilPublicoPage() {
  const { perfil, livrosLidos } = Route.useLoaderData();
  return <DetalhesPerfil key={perfil.id} perfilInicial={perfil} livrosLidos={livrosLidos} />;
}

function DetalhesPerfil({ perfilInicial, livrosLidos }: { perfilInicial: PerfilPublico; livrosLidos: LivroNaEstante[] }) {
  const [perfil, setPerfil] = useState(perfilInicial);
  const primeiroNome = perfil.nome.split(" ")[0];

  return (
    <LayoutPerfil
      titulo={perfil.nome}
      subtitulo={`As leituras e resenhas de @${perfil.usuario}.`}
      principal={
        <>
          <CarrosselLivros livros={livrosLidos} publico />
          <SobreUsuario bio={perfil.bio} generoFavorito={perfil.generoFavorito} titulo={`Sobre ${primeiroNome}`} />
          <ResenhasDoLeitor
            username={perfil.usuario}
            titulo={`Resenhas de ${primeiroNome}`}
            vazio={{ titulo: "Nenhuma resenha por aqui ainda", texto: `Quando ${primeiroNome} escrever uma resenha, ela aparece aqui.` }}
          />
        </>
      }
      lateral={
        <CartaoUsuario
          perfil={perfil}
          editavel={false}
          aoVerResenhas={rolarAteResenhas}
          acao={
            <BotaoSeguir
              usuarioId={perfil.id}
              nome={perfil.nome}
              seguindoInicial={perfil.euSigo}
              tamanho="normal"
              aoMudar={(euSigo, seguidores) => setPerfil((atual) => ({ ...atual, euSigo, social: { ...atual.social, seguidores } }))}
            />
          }
        />
      }
    />
  );
}
