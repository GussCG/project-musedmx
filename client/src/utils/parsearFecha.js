export function parseFecha(fecha) {
  const f = new Date(fecha);
  return isNaN(f.getTime()) ? new Date() : f;
}
