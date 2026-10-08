import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { LIMITES_PERFIL, TAMANHO_MAXIMO_AVATAR } from './perfil.validacao';

export class EditarPerfilDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITES_PERFIL.nomeMax)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITES_PERFIL.usernameMax)
  username: string;

  @IsString()
  @MaxLength(LIMITES_PERFIL.bioMax)
  bio: string;

  @IsString()
  @MaxLength(LIMITES_PERFIL.generoMax)
  generoFavorito: string;
}

export class SalvarAvatarDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(TAMANHO_MAXIMO_AVATAR)
  avatarUrl: string;
}

export class ObterPerfilPublicoDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
