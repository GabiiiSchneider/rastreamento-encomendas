import { useState, type FormEvent } from "react";
import { Autocomplete, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { DialogRetro } from "../../../components/DialogRetro";
import { BotaoRetro } from "../../../components/BotaoRetro";
import { cores, fontes, retro } from "../../../lib/tema";
import { editarPerfil } from "../perfil.functions";
import type { PerfilUsuario } from "../perfil.types";
import { GENEROS_SUGERIDOS, LIMITES_PERFIL, validarPerfil, type DadosPerfil, type ErrosPerfil } from "../perfil.validacao";

type Props = {
  aberto: boolean;
  perfil: PerfilUsuario;
  aoFechar: () => void;
  aoSalvar: () => void;
};

const estiloCampo = {
  "& .MuiInputLabel-root": { fontFamily: fontes.corpo, fontWeight: 500, color: cores.textoSuave },
  "& .MuiInputLabel-root.Mui-focused": { color: cores.terracotaEscura },
  "& .MuiInputLabel-root.Mui-error": { color: cores.terracotaEscura },
  "& .MuiOutlinedInput-root": {
    fontFamily: fontes.corpo,
    color: cores.tinta,
    backgroundColor: cores.fundo,
    borderRadius: 3,
    "& fieldset": { border: retro.borda },
    "&:hover fieldset": { borderColor: cores.tinta },
    "&.Mui-focused fieldset": { borderColor: cores.terracota, borderWidth: 2 },
    "&.Mui-error fieldset": { borderColor: cores.terracotaEscura },
  },
  "& .MuiFormHelperText-root": { fontFamily: fontes.corpo, color: cores.textoSuave, mx: 0.5 },
  "& .MuiFormHelperText-root.Mui-error": { color: cores.terracotaEscura, fontWeight: 500 },
};

function dadosIniciais(perfil: PerfilUsuario): DadosPerfil {
  return {
    nome: perfil.nome,
    username: perfil.usuario ?? "",
    bio: perfil.bio ?? "",
    generoFavorito: perfil.generoFavorito ?? "",
  };
}

export function DialogEditarPerfil({ aberto, perfil, aoFechar, aoSalvar }: Props) {
  const [dados, setDados] = useState<DadosPerfil>(() => dadosIniciais(perfil));
  const [erros, setErros] = useState<ErrosPerfil>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function alterar(campo: keyof DadosPerfil, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  function fechar() {
    if (salvando) return;
    setDados(dadosIniciais(perfil));
    setErros({});
    setErroGeral(null);
    aoFechar();
  }

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    const encontrados = validarPerfil(dados);
    setErros(encontrados);
    setErroGeral(null);
    if (Object.keys(encontrados).length > 0) return;

    setSalvando(true);
    try {
      const resultado = await editarPerfil({ data: dados });
      if (resultado.ok) {
        setSalvando(false);
        aoSalvar();
        return;
      }
      setErros(resultado.erros);
      setErroGeral(resultado.mensagem ?? null);
    } catch (erro) {
      const detalhe = erro instanceof Error && erro.message ? ` (${erro.message})` : "";
      setErroGeral(`Não foi possível salvar o perfil${detalhe}. Tente novamente.`);
    }
    setSalvando(false);
  }

  return (
    <DialogRetro
      aberto={aberto}
      aoFechar={fechar}
      aoEnviar={salvar}
      titulo="Editar perfil"
      acoes={
        <>
          <BotaoRetro variante="secundario" onClick={fechar} disabled={salvando}>
            Cancelar
          </BotaoRetro>
          <BotaoRetro type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </BotaoRetro>
        </>
      }
    >
      <Stack sx={{ gap: 2.5, pt: 1 }}>
        <TextField
          label="Nome"
          value={dados.nome}
          onChange={(e) => alterar("nome", e.target.value)}
          error={Boolean(erros.nome)}
          helperText={erros.nome ?? " "}
          required
          autoFocus
          fullWidth
          slotProps={{ htmlInput: { maxLength: LIMITES_PERFIL.nomeMax } }}
          sx={estiloCampo}
        />

        <TextField
          label="Nome de usuário"
          value={dados.username}
          // username não tem espaço nem maiúscula; já ajusta enquanto a pessoa digita
          onChange={(e) => alterar("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
          error={Boolean(erros.username)}
          helperText={erros.username ?? "Letras minúsculas, números, ponto e sublinhado, sem espaços."}
          required
          fullWidth
          slotProps={{
            htmlInput: { maxLength: LIMITES_PERFIL.usernameMax, autoCapitalize: "none", spellCheck: false },
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ "& .MuiTypography-root": { fontFamily: fontes.corpo, color: cores.terracotaEscura, fontWeight: 700 } }}>
                  @
                </InputAdornment>
              ),
            },
          }}
          sx={estiloCampo}
        />

        <TextField
          label="Bio"
          value={dados.bio}
          onChange={(e) => alterar("bio", e.target.value)}
          error={Boolean(erros.bio)}
          helperText={erros.bio ?? `${dados.bio.length}/${LIMITES_PERFIL.bioMax}`}
          multiline
          minRows={3}
          fullWidth
          slotProps={{ htmlInput: { maxLength: LIMITES_PERFIL.bioMax } }}
          sx={estiloCampo}
        />

        <Autocomplete
          freeSolo
          options={GENEROS_SUGERIDOS}
          inputValue={dados.generoFavorito}
          onInputChange={(_, valor) => alterar("generoFavorito", valor)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Gênero favorito"
              error={Boolean(erros.generoFavorito)}
              helperText={erros.generoFavorito ?? "Escolha uma sugestão ou escreva o seu."}
              slotProps={{ ...params.slotProps, htmlInput: { ...params.slotProps.htmlInput, maxLength: LIMITES_PERFIL.generoMax } }}
              sx={estiloCampo}
            />
          )}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                backgroundColor: cores.papel,
                border: retro.borda,
                boxShadow: retro.sombraLeve,
                borderRadius: 3,
                "& .MuiAutocomplete-option": { fontFamily: fontes.corpo, color: cores.tinta },
              },
            },
          }}
        />

        {erroGeral && (
          <Typography role="alert" sx={{ fontFamily: fontes.corpo, fontSize: 14, fontWeight: 500, color: cores.terracotaEscura }}>
            {erroGeral}
          </Typography>
        )}
      </Stack>
    </DialogRetro>
  );
}
