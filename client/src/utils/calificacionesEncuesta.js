import { CALIFICACIONES_RUBROS } from "../constants/catalog";

export const getCalificaciones = (config) => {
  let data = { icono: null, titulo: "" };

  // Se asume que el último rubro es el de menor calificación
  const rubricasOrdenadas = [...config.rubricas].sort(
    (a, b) => b.valor - a.valor
  );

  for (const rubrica of rubricasOrdenadas) {
    if (config.promedio >= rubrica.valor) {
      data.icono = rubrica.icono;
      data.titulo = rubrica.titulo;
      return data;
    }
  }

  // Si no se cumple ningún valor, se devuelve el de menor rubro
  const rubroMin = rubricasOrdenadas[rubricasOrdenadas.length - 1];
  if (rubroMin) {
    data.icono = rubroMin.icono;
    data.titulo = rubroMin.titulo;
  }

  return data;
};

export const procesarCalificaciones = (promediosMuseo) => {
  const config = {};

  // Si es un array vacío o no es un objeto válido, se usa objeto vacío como fallback
  const esArrayVacio =
    Array.isArray(promediosMuseo) && promediosMuseo.length === 0;
  const promedios =
    esArrayVacio || typeof promediosMuseo !== "object" ? {} : promediosMuseo;

  Object.keys(CALIFICACIONES_RUBROS).forEach((clave) => {
    const promedio = promedios[clave] || 0;
    const rubricas = CALIFICACIONES_RUBROS[clave];

    if (!rubricas || rubricas.length === 0) {
      config[clave] = {
        promedio: 0,
        rubricas: [],
        icono: null,
        titulo: "",
        width: 0,
      };
      return;
    }

    const datos = getCalificaciones({
      promedio,
      rubricas,
    });

    config[clave] = {
      promedio,
      rubricas,
      icono: datos.icono,
      titulo: datos.titulo,
      width: ((promedio / rubricas[0].valor) * 100).toFixed(2),
    };
  });

  return config;
};

export const procesarServicios = (servicios = []) => {
  const config = {};

  if (!Array.isArray(servicios) || servicios.length === 0) {
    return config;
  }

  const maxVeces = Math.max(...servicios.map((s) => s.veces || 0)) || 1;

  servicios.forEach((servicio) => {
    const { ser_id, ser_nombre, veces } = servicio;

    config[ser_id] = {
      nombre: ser_nombre,
      veces,
      opacidad: (veces / maxVeces).toFixed(2), // normaliza de 0 a 1
    };
  });

  return config;
};
