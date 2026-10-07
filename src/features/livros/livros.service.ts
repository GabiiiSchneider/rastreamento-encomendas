import { createServerFn } from "@tanstack/react-start";
import * as fs from 'node:fs'
import type { LivrosData } from "./livros.types";

const LIVROS_FILE = 'src/data/livros.json'

export const getLivros = createServerFn({ method: 'GET' }).handler(async () => {
    const livros = await fs.promises.readFile(LIVROS_FILE, 'utf-8')
    return JSON.parse(livros) as LivrosData
})
