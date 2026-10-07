import { createServerFn } from "@tanstack/react-start";
import { authService } from "./auth.compose";
import type { CreateUserDto, LoginDto } from "./auth.dto";

export const cadastrarUsuario = createServerFn({ method: "POST" })
  .validator((data: CreateUserDto) => data)
  .handler(async ({ data }) => {
    return authService.cadastrar(data);
  });

export const loginUsuario = createServerFn({ method: "POST" })
  .validator((data: LoginDto) => data)
  .handler(async ({ data }) => {
    return authService.login(data);
  });