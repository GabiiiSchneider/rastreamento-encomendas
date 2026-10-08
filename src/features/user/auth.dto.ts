import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';
import { LIMITES_CADASTRO } from './cadastro.validacao';
import { LIMITES_PERFIL } from '../perfil/perfil.validacao';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITES_PERFIL.nomeMax)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITES_PERFIL.usernameMax)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(LIMITES_CADASTRO.emailMax)
  email: string;

  @IsString()
  @MinLength(LIMITES_CADASTRO.senhaMin)
  @MaxLength(LIMITES_CADASTRO.senhaMax)
  password: string;

  @IsString()
  passwordConfirmation: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
