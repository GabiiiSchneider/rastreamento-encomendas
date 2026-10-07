// regras compartilhadas entre o formulário (cliente) e o servidor
export const LIMITES_PERFIL = {
  nomeMin: 2,
  nomeMax: 60,
  usernameMin: 3,
  usernameMax: 30,
  bioMax: 300,
  generoMax: 40,
};

// tamanho máximo do data URL da foto (uma JPEG 256x256 costuma ficar entre 20 e 60 KB)
export const TAMANHO_MAXIMO_AVATAR = 200_000;
export const FORMATO_AVATAR = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/;

const FORMATO_USERNAME = /^[a-z0-9._]+$/;

export const GENEROS_SUGERIDOS = [
  "Ficção",
  "Romance",
  "Fantasia",
  "Ficção científica",
  "Distopia",
  "Mistério",
  "Terror",
  "Poesia",
  "Biografia",
  "Ficção histórica",
  "Infantojuvenil",
];

export type DadosPerfil = {
  nome: string;
  username: string;
  bio: string;
  generoFavorito: string;
};

export type ErrosPerfil = Partial<Record<keyof DadosPerfil, string>>;

export function normalizarPerfil(dados: DadosPerfil): DadosPerfil {
  return {
    nome: dados.nome.trim().replace(/\s+/g, " "),
    username: dados.username.trim().toLowerCase(),
    bio: dados.bio.trim(),
    generoFavorito: dados.generoFavorito.trim(),
  };
}

export function validarPerfil(dados: DadosPerfil): ErrosPerfil {
  const { nome, username, bio, generoFavorito } = normalizarPerfil(dados);
  const erros: ErrosPerfil = {};

  if (nome.length < LIMITES_PERFIL.nomeMin) erros.nome = `O nome precisa ter pelo menos ${LIMITES_PERFIL.nomeMin} letras.`;
  else if (nome.length > LIMITES_PERFIL.nomeMax) erros.nome = `O nome pode ter no máximo ${LIMITES_PERFIL.nomeMax} caracteres.`;

  if (/\s/.test(username)) erros.username = "O nome de usuário não pode ter espaços.";
  else if (username.length < LIMITES_PERFIL.usernameMin) erros.username = `Use pelo menos ${LIMITES_PERFIL.usernameMin} caracteres.`;
  else if (username.length > LIMITES_PERFIL.usernameMax) erros.username = `Use no máximo ${LIMITES_PERFIL.usernameMax} caracteres.`;
  else if (!FORMATO_USERNAME.test(username)) erros.username = "Use só letras minúsculas, números, ponto e sublinhado.";

  if (bio.length > LIMITES_PERFIL.bioMax) erros.bio = `A bio pode ter no máximo ${LIMITES_PERFIL.bioMax} caracteres.`;
  if (generoFavorito.length > LIMITES_PERFIL.generoMax) erros.generoFavorito = `Use no máximo ${LIMITES_PERFIL.generoMax} caracteres.`;

  return erros;
}
