import { cores, fontes, retro } from "../lib/tema";

export const estiloCampoRetro = {
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
