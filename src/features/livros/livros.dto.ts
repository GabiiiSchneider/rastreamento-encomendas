import { IsString, IsNotEmpty, IsEnum, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { ReadingStatus } from '../../generated/prisma/enums';
import { ABAS_ESTANTE, type AbaEstante } from './livros.estante';

export class BuscarLivrosDto {
  @IsString()
  @IsNotEmpty()
  termo: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagina?: number;
}

export class ObterLivroDto {
  @IsString()
  @IsNotEmpty()
  livroId: string;
}

export class AdicionarNaEstanteDto {
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @IsEnum(ReadingStatus)
  status: ReadingStatus;
}

export class ObterStatusNaEstanteDto {
  @IsString()
  @IsNotEmpty()
  externalId: string;
}

export class ListarEstanteDto {
  @IsEnum(ReadingStatus)
  status: ReadingStatus;
}

export class ListarEstantePaginadaDto {
  @IsIn(ABAS_ESTANTE.map((aba) => aba.valor))
  aba: AbaEstante;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagina?: number;
}
