import { validarNome, validarUsername } from "../perfil/perfil.validacao";

export const LIMITES_CADASTRO = {
  emailMax: 254,
  senhaMin: 6,
  senhaMax: 72,
};

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type DadosCadastro = {
  nome: string;
  username: string;
  email: string;
  senha: string;
  confirmacao: string;
};

export type ErrosCadastro = Partial<Record<keyof DadosCadastro, string>>;

export function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizarCadastro(dados: DadosCadastro): DadosCadastro {
  return {
    nome: dados.nome.trim().replace(/\s+/g, " "),
    username: dados.username.trim().toLowerCase(),
    email: normalizarEmail(dados.email),
    senha: dados.senha,
    confirmacao: dados.confirmacao,
  };
}

export function validarCadastro(dados: DadosCadastro): ErrosCadastro {
  const { nome, username, email, senha, confirmacao } = normalizarCadastro(dados);
  const erros: ErrosCadastro = {};

  const erroNome = validarNome(nome);
  if (erroNome) erros.nome = erroNome;

  const erroUsername = validarUsername(username);
  if (erroUsername) erros.username = erroUsername;

  if (!email) erros.email = "Informe seu e-mail.";
  else if (email.length > LIMITES_CADASTRO.emailMax || !FORMATO_EMAIL.test(email)) erros.email = "Esse e-mail não parece válido.";

  if (senha.length < LIMITES_CADASTRO.senhaMin) erros.senha = `A senha precisa ter pelo menos ${LIMITES_CADASTRO.senhaMin} caracteres.`;
  else if (new TextEncoder().encode(senha).length > LIMITES_CADASTRO.senhaMax) erros.senha = `A senha pode ter no máximo ${LIMITES_CADASTRO.senhaMax} caracteres.`;

  if (confirmacao !== senha) erros.confirmacao = "As senhas não são iguais.";

  return erros;
}
