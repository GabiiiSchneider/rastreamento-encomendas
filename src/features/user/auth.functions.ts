import { createServerFn } from "@tanstack/react-start";
import { authService } from "./auth.compose";
import type { CreateUserDto, LoginDto } from "./auth.dto";
import { usarSessao } from "../../lib/sessao";
import { comUsuario } from "../../lib/autenticacao";

export const cadastrarUsuario = createServerFn({ method: "POST" })
  .validator((data: CreateUserDto) => data)
  .handler(async ({ data }) => {
    const resultado = await authService.cadastrar(data);
    if (!resultado.ok) return resultado;

    const sessao = await usarSessao();
    await sessao.update({ userId: resultado.userId });
    return { ok: true as const, usuario: await authService.obterUsuarioLogado(resultado.userId) };
  });

export const loginUsuario = createServerFn({ method: "POST" })
  .validator((data: LoginDto) => data)
  .handler(async ({ data }) => {
    const usuario = await authService.login(data);
    const sessao = await usarSessao();
    await sessao.update({ userId: usuario.id });
    return authService.obterUsuarioLogado(usuario.id);
  });

export const logoutUsuario = createServerFn({ method: "POST" }).handler(async () => {
  const sessao = await usarSessao();
  await sessao.clear();
});

export const obterUsuarioLogado = createServerFn({ method: "GET" })
  .middleware([comUsuario])
  .handler(async ({ context }) => {
    if (!context.userId) return null;
    const usuario = await authService.obterUsuarioLogado(context.userId);
    if (!usuario) await (await usarSessao()).clear();
    return usuario;
  });
