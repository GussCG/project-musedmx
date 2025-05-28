export function parseTematicas(tematicas) {
  if (!tematicas) return [];
  return typeof tematicas === "string" ? JSON.parse(tematicas) : tematicas;
}
