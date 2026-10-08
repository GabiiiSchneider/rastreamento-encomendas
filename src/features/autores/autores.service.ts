import type { AutorCatalogo, ProvedorCatalogo } from "../../catalogo/catalogo.port.ts";
import type { Tradutor } from "../../traducao/traducao.port.ts";

export class AutoresService {
  private catalogo: ProvedorCatalogo;
  private tradutor: Tradutor;

  constructor(catalogo: ProvedorCatalogo, tradutor: Tradutor) {
    this.catalogo = catalogo;
    this.tradutor = tradutor;
  }

  async obterAutor(autorId: string, idioma?: string): Promise<AutorCatalogo | null> {
    const autor = await this.catalogo.buscarAutor(autorId);
    if (!autor?.biografia || !idioma) return autor;

    const [biografia] = await this.tradutor.traduzir([autor.biografia], idioma);
    return { ...autor, biografia };
  }

  buscar(termo: string, pagina = 1, limite?: number) {
    return this.catalogo.buscarAutores(termo, pagina, limite);
  }

  listarLivros(autorId: string, pagina = 1, idioma?: string, limite?: number) {
    return this.catalogo.buscarLivrosDoAutor(autorId, pagina, idioma, limite);
  }
}
