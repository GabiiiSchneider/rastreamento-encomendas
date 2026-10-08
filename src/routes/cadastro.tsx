import { createFileRoute, redirect } from "@tanstack/react-router";
import { LayoutAutenticacao } from "../features/user/components/LayoutAutenticacao";
import { CadastroBoasVindas } from "../features/user/components/CadastroBoasVindas";
import { validarBuscaAutenticacao } from "../features/user/rotasAutenticacao";

export const Route = createFileRoute("/cadastro")({
  validateSearch: validarBuscaAutenticacao,
  beforeLoad: ({ context, search }) => {
    if (context.usuario) {
      throw redirect({ href: search.redirect ?? "/home" });
    }
  },
  component: CadastroPage,
});

function CadastroPage() {
  return (
    <LayoutAutenticacao ilustracao={{ src: "/ilustracoes/Transhumans - Experiments.png", alt: "Ilustração de duas pessoas sentadas no chão mexendo juntas em aparelhos" }}>
      <CadastroBoasVindas />
    </LayoutAutenticacao>
  );
}
