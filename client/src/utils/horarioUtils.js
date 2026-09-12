import { formatearHora } from "./formatearFechas";

export const procesarHorarioActual = (horarios) => {
  if (!horarios || horarios.length === 0) return null;

  const hoyStr = new Date()
    .toLocaleDateString("es-MX", {
      weekday: "long",
      timeZone: "America/Mexico_City",
    })
    .toLowerCase();

  const actual = horarios.find((h) => h?.dia.toLowerCase() === hoyStr);

  if (!actual) return null;

  const estaCerrado =
    actual.hora_inicio === "00:00:00" && actual.hora_fin === "00:00:00";

  const precios = [
    parseFloat(actual.precio_ad),
    parseFloat(actual.precio_est),
    parseFloat(actual.precio_ni),
    parseFloat(actual.precio_ter),
  ].filter((p) => p >= 0);

  const precioMinimo = precios.length > 0 ? Math.min(...precios) : 0;

  return {
    ...actual,
    estaCerrado,
    textoEstado: estaCerrado
      ? "Cerrado hoy"
      : `Cierra a las ${formatearHora(actual.hora_fin)}`,
    precioDesde: precioMinimo === 0 ? "Gratis" : `$${precioMinimo} MXN`,
    esGratis: precioMinimo === 0 && !estaCerrado,
    aceptaDonativos:
      !estaCerrado &&
      [
        actual.precio_ad,
        actual.precio_ni,
        actual.precio_est,
        actual.precio_ter,
      ].every((p) => p === "-1"),
  };
};
