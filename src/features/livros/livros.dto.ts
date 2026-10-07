import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ReadingStatus } from '../../generated/prisma/enums';

export class BuscarLivrosDto {
  @IsString()
  @IsNotEmpty()
  termo: string;
}

export class AdicionarNaEstanteDto {
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @IsEnum(ReadingStatus)
  status: ReadingStatus;
}

export class ListarEstanteDto {
  @IsEnum(ReadingStatus)
  status: ReadingStatus;
}
