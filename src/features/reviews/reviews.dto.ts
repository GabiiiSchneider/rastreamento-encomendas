import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { ABAS_FEED, FILTROS_SPOILER, type AbaFeed, type FiltroSpoiler } from './reviews.feed';
import { FORMATO_EXTERNAL_ID, LIMITES_RESENHA } from './reviews.validacao';

export class ListarFeedDto {
  @IsIn(ABAS_FEED.map((aba) => aba.valor))
  aba: AbaFeed;

  @IsOptional()
  @IsIn(FILTROS_SPOILER.map((filtro) => filtro.valor))
  filtro?: FiltroSpoiler;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class PublicarResenhaDto {
  @IsString()
  @Matches(FORMATO_EXTERNAL_ID)
  externalId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITES_RESENHA.conteudoMax)
  conteudo: string;

  @IsOptional()
  @IsInt()
  @Min(LIMITES_RESENHA.notaMin)
  @Max(LIMITES_RESENHA.notaMax)
  nota?: number | null;

  @IsBoolean()
  temSpoiler: boolean;
}

export class ResenhaIdDto {
  @IsString()
  @IsNotEmpty()
  resenhaId: string;
}

export class ComentarDto {
  @IsString()
  @IsNotEmpty()
  resenhaId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITES_RESENHA.comentarioMax)
  conteudo: string;
}

export class ComentarioIdDto {
  @IsString()
  @IsNotEmpty()
  comentarioId: string;
}

export class ResenhasDoLeitorDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class BuscarResenhasDto {
  @IsString()
  @IsNotEmpty()
  termo: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  limite?: number;
}
