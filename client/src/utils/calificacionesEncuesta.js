import { CALIFICACIONES_RUBROS } from "../constants/catalog";

export const getCalificaciones = (config) => {
  let data = { icono: null, titulo: "" };

  // Se ordenan de mayor a menor para encontrar el título e ícono más adecuado
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

  // Si ningún valor coincide, usar el menor
  const rubroMin = rubricasOrdenadas[rubricasOrdenadas.length - 1];
  if (rubroMin) {
    data.icono = rubroMin.icono;
    data.titulo = rubroMin.titulo;
  }

  return data;
};

export const procesarCalificaciones = (promediosMuseo) => {
  const config = {};

  if (!Array.isArray(promediosMuseo) || promediosMuseo.length === 0) {
    return config;
  }

  promediosMuseo.forEach((promedio) => {
    const { preg_id, promedio_respuesta } = promedio;
    const rubricas = CALIFICACIONES_RUBROS[preg_id];

    if (rubricas) {
      const promedioNum = parseFloat(promedio_respuesta) || 0;
      const { icono, titulo } = getCalificaciones({
        promedio: promedioNum,
        rubricas,
      });

      const maxValor = Math.max(...rubricas.map((r) => r.valor));

      config[preg_id] = {
        id: preg_id,
        icono,
        titulo,
        promedio: promedioNum,
        rubricas,
        width: Math.min((promedioNum / maxValor) * 100, 100).toFixed(2),
      };
    }
  });

  return config;
};

export const procesarServicios = (servicios = []) => {
  const config = {};

  if (!Array.isArray(servicios) || servicios.length === 0) {
    return config;
  }

  const maxVeces =
    Math.max(...servicios.map((s) => parseFloat(s.veces_seleccionado) || 0)) ||
    1;

  servicios.forEach((servicio) => {
    const { ser_id, ser_nombre, veces_seleccionado } = servicio;
    const veces = parseFloat(veces_seleccionado);

    config[ser_id] = {
      nombre: ser_nombre,
      veces,
      opacidad: (veces / maxVeces).toFixed(2),
    };
  });

  return config;
};
