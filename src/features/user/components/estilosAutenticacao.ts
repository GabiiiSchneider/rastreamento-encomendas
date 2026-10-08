import { cores, fontes } from "../../../lib/tema";

export const campoEscuro = {
  "& .MuiOutlinedInput-root": {
    color: cores.papel,
    fontFamily: fontes.corpo,
    borderRadius: 3,
    backgroundColor: cores.tintaClara,
    "& fieldset": { borderColor: cores.bordaEscura },
    "&:hover fieldset": { borderColor: cores.rosa },
    "&.Mui-focused fieldset": { borderColor: cores.mostarda, borderWidth: 2 },
    "&.Mui-error fieldset": { borderColor: cores.rosa },
  },
  "& .MuiInputLabel-root": { color: cores.textoClaro, fontFamily: fontes.corpo },
  "& .MuiInputLabel-root.Mui-focused": { color: cores.mostarda },
  "& .MuiInputLabel-root.Mui-error": { color: cores.rosa },
  "& .MuiFormHelperText-root": { fontFamily: fontes.corpo, color: cores.textoClaro, mx: 0.5 },
  "& .MuiFormHelperText-root.Mui-error": { color: cores.rosa, fontWeight: 500 },
};

export const botaoAutenticacao = {
  mt: 1,
  py: 1.4,
  borderRadius: 3,
  backgroundColor: cores.mostarda,
  color: cores.tinta,
  boxShadow: `4px 4px 0 ${cores.terracota}`,
  fontFamily: fontes.corpo,
  fontWeight: 700,
  fontSize: "1.1rem",
  textTransform: "none",
  transition: "transform 0.15s, box-shadow 0.15s",
  "&:hover": {
    backgroundColor: cores.mostardaEscura,
    transform: "translate(-1px, -1px)",
    boxShadow: `5px 5px 0 ${cores.terracota}`,
  },
  "&.Mui-disabled": { backgroundColor: cores.mostarda, color: cores.tinta, opacity: 0.6 },
} as const;

export const textoTrocarTela = { fontFamily: fontes.corpo, fontSize: 15, color: cores.textoClaro };

export const linkTrocarTela = { fontFamily: fontes.corpo, fontWeight: 700, color: cores.mostarda };
