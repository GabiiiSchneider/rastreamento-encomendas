export function brilho(cx: number, cy: number, r: number) {
  const c = r * 0.18;
  return `M${cx} ${cy - r} Q${cx + c} ${cy - c} ${cx + r} ${cy} Q${cx + c} ${cy + c} ${cx} ${cy + r} Q${cx - c} ${cy + c} ${cx - r} ${cy} Q${cx - c} ${cy - c} ${cx} ${cy - r} Z`;
}

export function espiral(cx: number, cy: number, raio: number, voltas: number) {
  const passos = voltas * 40;
  return Array.from({ length: passos + 1 }, (_, i) => {
    const t = (i / passos) * voltas * 2 * Math.PI;
    const r = (raio * i) / passos;
    return `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
  }).join(" ");
}