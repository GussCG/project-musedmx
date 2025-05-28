export function formatMuseoImageName(nombre) {
  return nombre
    .toLowerCase()
    .replace(/:/g, "")
    .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitaliza primero
    .replace(/ /g, "_"); // Luego reemplaza espacios
}
