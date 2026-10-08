import { useState, type FormEvent } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { Alert, Box, Button, InputAdornment, TextField } from "@mui/material";
import { cores, fontes } from "../../../lib/tema";
import { cadastrarUsuario } from "../auth.functions";
import { LIMITES_CADASTRO, validarCadastro, type DadosCadastro, type ErrosCadastro } from "../cadastro.validacao";
import { LIMITES_PERFIL } from "../../perfil/perfil.validacao";
import { botaoAutenticacao, campoEscuro } from "./estilosAutenticacao";

const VAZIO: DadosCadastro = { nome: "", username: "", email: "", senha: "", confirmacao: "" };

export function CadastroForm() {
  const router = useRouter();
  const { redirect } = useSearch({ from: "/cadastro" });
  const [dados, setDados] = useState<DadosCadastro>(VAZIO);
  const [erros, setErros] = useState<ErrosCadastro>({});
  const [erroGeral, setErroGeral] = useState("");
  const [carregando, setCarregando] = useState(false);

  function alterar(campo: keyof DadosCadastro, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault();
    setErroGeral("");
    const encontrados = validarCadastro(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setCarregando(true);
    try {
      const resultado = await cadastrarUsuario({
        data: {
          name: dados.nome,
          username: dados.username,
          email: dados.email,
          password: dados.senha,
          passwordConfirmation: dados.confirmacao,
        },
      });
      if (!resultado.ok) {
        setErros(resultado.erros);
        setCarregando(false);
        return;
      }
      await router.invalidate();
      await router.navigate({ href: redirect ?? "/home" });
    } catch (erro) {
      const detalhe = erro instanceof Error && erro.message ? ` (${erro.message})` : "";
      setErroGeral(`Não foi possível criar a conta${detalhe}. Tente novamente.`);
      setCarregando(false);
    }
  }

  return (
    <Box component="form" onSubmit={cadastrar} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 380 }}>
      {erroGeral && <Alert severity="error">{erroGeral}</Alert>}

      <TextField
        label="Nome"
        value={dados.nome}
        onChange={(e) => alterar("nome", e.target.value)}
        error={Boolean(erros.nome)}
        helperText={erros.nome}
        autoComplete="name"
        required
        slotProps={{ htmlInput: { maxLength: LIMITES_PERFIL.nomeMax } }}
        sx={campoEscuro}
      />
      <TextField
        label="Nome de usuário"
        value={dados.username}
        onChange={(e) => alterar("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
        error={Boolean(erros.username)}
        helperText={erros.username ?? "Letras minúsculas, números, ponto e sublinhado."}
        autoComplete="username"
        required
        slotProps={{
          htmlInput: { maxLength: LIMITES_PERFIL.usernameMax, autoCapitalize: "none", spellCheck: false },
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ "& .MuiTypography-root": { fontFamily: fontes.corpo, fontWeight: 700, color: cores.mostarda } }}>
                @
              </InputAdornment>
            ),
          },
        }}
        sx={campoEscuro}
      />
      <TextField
        label="E-mail"
        type="email"
        value={dados.email}
        onChange={(e) => alterar("email", e.target.value)}
        error={Boolean(erros.email)}
        helperText={erros.email}
        autoComplete="email"
        required
        slotProps={{ htmlInput: { maxLength: LIMITES_CADASTRO.emailMax } }}
        sx={campoEscuro}
      />
      <TextField
        label="Senha"
        type="password"
        value={dados.senha}
        onChange={(e) => alterar("senha", e.target.value)}
        error={Boolean(erros.senha)}
        helperText={erros.senha ?? `Pelo menos ${LIMITES_CADASTRO.senhaMin} caracteres.`}
        autoComplete="new-password"
        required
        slotProps={{ htmlInput: { maxLength: LIMITES_CADASTRO.senhaMax } }}
        sx={campoEscuro}
      />
      <TextField
        label="Confirmar senha"
        type="password"
        value={dados.confirmacao}
        onChange={(e) => alterar("confirmacao", e.target.value)}
        error={Boolean(erros.confirmacao)}
        helperText={erros.confirmacao}
        autoComplete="new-password"
        required
        slotProps={{ htmlInput: { maxLength: LIMITES_CADASTRO.senhaMax } }}
        sx={campoEscuro}
      />

      <Button type="submit" disabled={carregando} sx={botaoAutenticacao}>
        {carregando ? "Criando conta..." : "Criar conta"}
      </Button>
    </Box>
  );
}
