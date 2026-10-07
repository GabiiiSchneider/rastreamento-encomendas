import { IsString, IsNotEmpty, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ReadingStatus } from '../../generated/prisma/enums';

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
