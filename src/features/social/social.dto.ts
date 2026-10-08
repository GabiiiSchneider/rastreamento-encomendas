import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import type { TipoConexao } from './social.types';

export class SeguirDto {
  @IsString()
  @IsNotEmpty()
  usuarioId: string;
}

export class SugestoesDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limite?: number;
}

export class BuscarLeitoresDto {
  @IsString()
  @IsNotEmpty()
  termo: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagina?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  limite?: number;
}

export class ListarConexoesDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsIn(['seguidores', 'seguindo'])
  tipo: TipoConexao;
}
