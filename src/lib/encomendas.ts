import { createServerFn } from "@tanstack/react-start";
import * as fs from 'node:fs'
import type { EncomendasData } from "../features/encomendas/encomendas.types"

const ENCOMENDAS_FILE = 'src/data/encomendas.json'

export const getJokes = createServerFn({ method: 'GET' }).handler(async () => {
    const encomendas = await fs.promises.readFile(ENCOMENDAS_FILE, 'utf-8')
    return JSON.parse(encomendas) as EncomendasData
})