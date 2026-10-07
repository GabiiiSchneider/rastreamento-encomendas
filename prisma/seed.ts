import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.ts";
import { livrosService } from "../src/features/livros/livros.compose.ts";

const USUARIO = {
  name: "Gabriela",
  email: "gabriela@teste.com",
  senha: "estante123",
};

const PERFIL = {
  username: "gabi",
  bio: "Leitora compulsiva, colecionadora de marcadores e defensora de que todo livro merece uma segunda chance. Amo clássicos brasileiros, distopias e histórias que me fazem chorar no ônibus.",
  favorite_genre: "Romance",
};

const META = { year: 2026, target: 30 };

const LIVROS_LIDOS = [
  { externalId: "/works/OL1003040W", titulo: "Dom Casmurro", lidoEm: "2026-03-12" },
  { externalId: "/works/OL1002120W", titulo: "A Hora da Estrela", lidoEm: "2026-04-28" },
  { externalId: "/works/OL1168083W", titulo: "1984", lidoEm: "2026-05-20" },
  { externalId: "/works/OL66554W", titulo: "Orgulho e Preconceito", lidoEm: "2026-07-03" },
  { externalId: "/works/OL274505W", titulo: "Cem Anos de Solidão", lidoEm: "2026-08-17" },
  { externalId: "/works/OL10263W", titulo: "O Pequeno Príncipe", lidoEm: "2026-10-02" },
];

const LENDO = [{ externalId: "/works/OL1756937W", titulo: "Grande Sertão: Veredas", iniciadoEm: "2026-09-28" }];

const QUERO_LER = [
  { externalId: "/works/OL24141556W", titulo: "Torto Arado" },
  { externalId: "/works/OL1248157W", titulo: "Capitães da Areia" },
];

async function obterOuCriarUsuario() {
  const existente = await prisma.user.findUnique({ where: { email: USUARIO.email } });
  if (existente) return existente;

  console.log(`Criando o usuário ${USUARIO.email} (senha: ${USUARIO.senha})`);
  return prisma.user.create({
    data: {
      name: USUARIO.name,
      email: USUARIO.email,
      password: await bcrypt.hash(USUARIO.senha, 10),
    },
  });
}

async function main() {
  const usuario = await obterOuCriarUsuario();

  await prisma.profile.upsert({
    where: { user_id: usuario.id },
    update: PERFIL,
    create: { user_id: usuario.id, ...PERFIL },
  });
  console.log(`✓ perfil @${PERFIL.username}`);

  await prisma.readingGoal.upsert({
    where: { user_id_year: { user_id: usuario.id, year: META.year } },
    update: { target: META.target },
    create: { user_id: usuario.id, ...META },
  });
  console.log(`✓ meta de ${META.year}: ${META.target} livros`);

  for (const livro of LIVROS_LIDOS) {
    await livrosService.adicionarNaEstante(usuario.id, livro.externalId, "READ", {
      finishedAt: new Date(`${livro.lidoEm}T12:00:00Z`),
    });
    console.log(`✓ lido: ${livro.titulo}`);
  }

  for (const livro of LENDO) {
    await livrosService.adicionarNaEstante(usuario.id, livro.externalId, "READING", {
      startedAt: new Date(`${livro.iniciadoEm}T12:00:00Z`),
    });
    console.log(`✓ lendo: ${livro.titulo}`);
  }

  for (const livro of QUERO_LER) {
    await livrosService.adicionarNaEstante(usuario.id, livro.externalId, "WANT_TO_READ");
    console.log(`✓ quero ler: ${livro.titulo}`);
  }

  console.log(`Seed concluído para ${USUARIO.email}.`);
}

main()
  .catch((erro) => {
    console.error("Erro no seed:", erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
