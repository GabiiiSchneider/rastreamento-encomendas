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

export function validarNome(nome: string): string | null {
  if (nome.length < LIMITES_PERFIL.nomeMin) return `O nome precisa ter pelo menos ${LIMITES_PERFIL.nomeMin} letras.`;
  if (nome.length > LIMITES_PERFIL.nomeMax) return `O nome pode ter no máximo ${LIMITES_PERFIL.nomeMax} caracteres.`;
  return null;
}

export function validarUsername(username: string): string | null {
  if (/\s/.test(username)) return "O nome de usuário não pode ter espaços.";
  if (username.length < LIMITES_PERFIL.usernameMin) return `Use pelo menos ${LIMITES_PERFIL.usernameMin} caracteres.`;
  if (username.length > LIMITES_PERFIL.usernameMax) return `Use no máximo ${LIMITES_PERFIL.usernameMax} caracteres.`;
  if (!FORMATO_USERNAME.test(username)) return "Use só letras minúsculas, números, ponto e sublinhado.";
  return null;
}

export function validarPerfil(dados: DadosPerfil): ErrosPerfil {
  const { nome, username, bio, generoFavorito } = normalizarPerfil(dados);
  const erros: ErrosPerfil = {};

  const erroNome = validarNome(nome);
  if (erroNome) erros.nome = erroNome;

  const erroUsername = validarUsername(username);
  if (erroUsername) erros.username = erroUsername;

  if (bio.length > LIMITES_PERFIL.bioMax) erros.bio = `A bio pode ter no máximo ${LIMITES_PERFIL.bioMax} caracteres.`;
  if (generoFavorito.length > LIMITES_PERFIL.generoMax) erros.generoFavorito = `Use no máximo ${LIMITES_PERFIL.generoMax} caracteres.`;

  return erros;
}
