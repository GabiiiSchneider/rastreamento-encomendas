import { provedorCatalogo } from "../../catalogo/catalogo.compose.ts";
import { tradutor } from "../../traducao/traducao.compose.ts";
import { AutoresService } from "./autores.service.ts";

export const autoresService = new AutoresService(provedorCatalogo, tradutor);
