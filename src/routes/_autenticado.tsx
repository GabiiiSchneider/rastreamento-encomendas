import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_autenticado")({
  beforeLoad: ({ context, location }) => {
    if (!context.usuario) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { usuario: context.usuario };
  },
  component: Outlet,
});
