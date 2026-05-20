export default function parseCalificacion(calificacion) {
  const parsed = parseFloat(calificacion);
  return isNaN(parsed) ? 0 : parsed;
}
