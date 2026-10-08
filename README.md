# Estante

Rede social para leitores: guarde o que você leu, está lendo e quer ler, escreva resenhas, siga amigos e descubra livros pela [Open Library](https://openlibrary.org).

Feito com TanStack Start, React, MUI, Prisma 7 e PostgreSQL.

## Rodando no computador

Pré-requisitos: Node 22, pnpm e um PostgreSQL (local ou no Neon).

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Crie o arquivo `.env` a partir do exemplo e preencha as duas variáveis:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: a conexão com o seu PostgreSQL.
   - `SESSION_SECRET`: uma senha aleatória com pelo menos 32 caracteres. Para gerar:

     ```bash
     openssl rand -base64 48
     ```

3. Crie as tabelas e gere o Prisma Client:

   ```bash
   pnpm prisma migrate deploy --config prisma7.config.ts
   pnpm prisma generate --config prisma7.config.ts
   ```

4. Suba o servidor em http://localhost:3000:

   ```bash
   pnpm dev
   ```

Para conferir os tipos, rode `pnpm tsc --noEmit`.

## Deploy

O site roda de graça na **Netlify**, com o banco PostgreSQL no **Neon**. As páginas renderizadas no servidor e as server functions viram funções serverless da Netlify, por meio do plugin oficial `@netlify/vite-plugin-tanstack-start`, que já está configurado no `vite.config.ts`.

### 1. Banco no Neon

1. Crie um projeto em [neon.tech](https://neon.tech).
2. Em **Connect**, copie as duas strings de conexão:
   - **com pooling** (o host termina em `-pooler`): é a que o site usa na Netlify, porque as funções serverless abrem muitas conexões curtas;
   - **direta** (sem `-pooler`): use só para aplicar as migrations.
3. Aplique as migrations a partir do seu computador, passando a URL **direta** no próprio comando. Assim você não precisa trocar o seu `.env`:

   ```bash
   DATABASE_URL="postgresql://USUARIO:SENHA@HOST-DIRETO.neon.tech/BANCO?sslmode=require" pnpm prisma migrate deploy --config prisma7.config.ts
   ```

   Rode esse comando de novo sempre que uma migration nova for criada.

### 2. Site na Netlify

1. Envie o projeto para o GitHub. As pastas `src/generated` e `.env` ficam de fora, pelo `.gitignore`.
2. Na Netlify, use **Add new project → Import an existing project** e escolha o repositório. As configurações de build vêm do `netlify.toml`:
   - comando: `pnpm build`, que roda `prisma generate` e depois `vite build`;
   - pasta publicada: `dist/client`;
   - Node 22.
3. Em **Project configuration → Environment variables**, cadastre:

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | a string do Neon **com pooling** (host com `-pooler`), terminando em `?sslmode=require` |
   | `SESSION_SECRET` | uma senha nova, gerada com `openssl rand -base64 48` (não reaproveite a do seu computador) |

4. Faça o deploy. Se você mudar as variáveis depois, rode **Trigger deploy** para valer.

### Como funciona em produção

- **Sessão:** o cookie `estante_sessao` é `httpOnly` e, no build de produção, também `secure`, ou seja, só trafega por HTTPS. No `pnpm dev` ele não é `secure`, para funcionar em `http://localhost`.
- **Banco:** o Prisma usa o adapter `pg` com um pool pequeno (até 5 conexões por função). O SSL do Neon vem do `sslmode=require` na URL.
- **Prisma Client:** é gerado no início de cada build, porque `src/generated` não vai para o GitHub.

### Problemas comuns

- **"Defina a variável de ambiente SESSION_SECRET..."**: a variável não foi cadastrada na Netlify ou tem menos de 32 caracteres.
- **Erro de conexão com o banco**: confira se a `DATABASE_URL` da Netlify é a URL **com pooling** e termina em `?sslmode=require`.
- **"relation ... does not exist"**: as migrations não foram aplicadas no Neon. Rode o comando do passo 1.3.
