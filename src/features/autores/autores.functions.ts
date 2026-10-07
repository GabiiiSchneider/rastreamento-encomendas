import { createServerFn } from "@tanstack/react-start";
import { autoresService } from "./autores.compose";
import { autorIdValido } from "./autores.ids";
import { obterIdiomaDoNavegador } from "../../traducao/idioma";
import type { ListarLivrosDoAutorDto, ObterAutorDto } from "./autores.dto";

export const obterAutor = createServerFn({ method: "GET" })
  .validator((data: ObterAutorDto) => data)
  .handler(async ({ data }) => {
    if (!autorIdValido(data.autorId)) return null;
    return autoresService.obterAutor(data.autorId, obterIdiomaDoNavegador());
  });

export const listarLivrosDoAutor = createServerFn({ method: "GET" })
  .validator((data: ListarLivrosDoAutorDto) => data)
  .handler(async ({ data }) => {
    return autoresService.listarLivros(data.autorId, data.pagina, obterIdiomaDoNavegador(), data.limite);
  });
