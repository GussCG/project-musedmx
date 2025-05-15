import Icons from "../components/Other/IconProvider";
import { CALIFICACIONES_RUBROS } from "../constants/catalog";

export const getCalificaciones = (config) => {
  let data = { icono: null, titulo: "" };
  for (const rubrica of config.rubricas) {
    if (config.promedio >= rubrica.valor) {
      data.icono = rubrica.icono;
      data.titulo = rubrica.titulo;
      break;
    }
  }
  return data;
};

export const procesarCalificaciones = (promediosMuseo) => {
  const config = {};

  Object.keys(CALIFICACIONES_RUBROS).forEach((clave) => {
    const promedio = promediosMuseo[clave.toLowerCase()] || 0;
    const rubricas = CALIFICACIONES_RUBROS[clave];
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
