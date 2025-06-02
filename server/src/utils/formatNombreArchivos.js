export function formatMuseoImageName(nombre) {
  return nombre
    .toLowerCase()
    .replace(/:/g, "")
    .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitaliza primero
    .replace(/ /g, "_"); // Luego reemplaza espacios
}

export function formatReviewImageName(nombre) {
  return nombre
    .toLowerCase()
    .replace(/:/g, "")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/ /g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "") // Remove other special characters
    .replace(/^_+|_+$/g, "")       // Trim underscores
    .slice(0, 100);                // Limit length if needed
}