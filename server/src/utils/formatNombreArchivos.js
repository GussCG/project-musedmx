export function formatMuseoImageName(nombre) {
  return nombre
    .replace(/ /g, "_")
    .replace(/:/g, "")
    .replace(/\by\b/g, "Y") // opcional: reemplaza " y " por " Y "
    .replace(/\b\w/g, (l) => l.toUpperCase()); // capitaliza cada palabra
}
