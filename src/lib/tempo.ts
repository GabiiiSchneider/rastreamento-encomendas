const dataCurta = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });
const dataComAno = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric" });

const MINUTO = 60;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;
const SEMANA = 7 * DIA;

export function tempoRelativo(iso: string, agora = new Date()) {
  const data = new Date(iso);
  const segundos = Math.max(0, Math.round((agora.getTime() - data.getTime()) / 1000));

  if (segundos < MINUTO) return "agora";
  if (segundos < HORA) return `há ${Math.floor(segundos / MINUTO)} min`;
  if (segundos < DIA) return `há ${Math.floor(segundos / HORA)} h`;
  if (segundos < SEMANA) return `há ${Math.floor(segundos / DIA)} d`;
  return data.getFullYear() === agora.getFullYear() ? dataCurta.format(data) : dataComAno.format(data);
}

export function dataCompleta(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" });
}
