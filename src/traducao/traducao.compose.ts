import type { Tradutor } from './traducao.port.ts'
import { tradutorGoogle } from './traducao.google.ts'

export const tradutor: Tradutor = tradutorGoogle
