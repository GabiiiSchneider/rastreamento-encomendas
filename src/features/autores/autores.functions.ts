import { createServerFn } from "@tanstack/react-start";
import { autoresService } from "./autores.compose";
import { autorIdValido } from "./autores.ids";
import { obterIdiomaDoNavegador } from "../../traducao/idioma";
import type { BuscarAutoresDto, ListarLivrosDoAutorDto, ObterAutorDto } from "./autores.dto";

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

export const buscarAutores = createServerFn({ method: "GET" })
  .validator((data: BuscarAutoresDto) => data)
  .handler(async ({ data }) => {
    return autoresService.buscar(String(data.termo), data.pagina, data.limite);
  });
