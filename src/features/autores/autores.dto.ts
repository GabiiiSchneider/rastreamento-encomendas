import { IsString, IsNotEmpty, IsInt, IsOptional, Min, Max } from 'class-validator';

export class ObterAutorDto {
  @IsString()
  @IsNotEmpty()
  autorId: string;
}

export class ListarLivrosDoAutorDto {
  @IsString()
  @IsNotEmpty()
  autorId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagina?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limite?: number;
}
