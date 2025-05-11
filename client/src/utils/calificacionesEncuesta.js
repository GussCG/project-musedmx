import Icons from "../components/IconProvider";

const rubrosBase = {
  Edad: [
    { valor: 3, titulo: "Para Adultos", icono: Icons.adultoIcon },
    { valor: 2, titulo: "Para toda la familia", icono: Icons.familiarIcon },
    { valor: 1, titulo: "Para Niños", icono: Icons.ninoIcon },
  ],
  Interesante: [
    { valor: 5, titulo: "Muy Interesante", icono: Icons.dormirIcon },
    { valor: 4, titulo: "Interesante", icono: Icons.dormirIcon },
    { valor: 3, titulo: "Poco Interesante", icono: Icons.dormirIcon },
    { valor: 2, titulo: "Aburrido", icono: Icons.dormirIcon },
  ],
  Limpio: [
    { valor: 1, titulo: "Limpio", icono: Icons.limpioIcon },
    { valor: 0.5, titulo: "Sucio", icono: Icons.limpioIcon },
  ],

  Entendible: [
    { valor: 1, titulo: "Entendible", icono: Icons.entendibleIcon },
    { valor: 0.5, titulo: "Difícil", icono: Icons.entendibleIcon },
  ],

  Costo: [
    { valor: 4, titulo: "Muy Caro", icono: Icons.moneyIcon },
    { valor: 3, titulo: "Caro", icono: Icons.moneyIcon },
    { valor: 2, titulo: "Barato", icono: Icons.moneyIcon },
    { valor: 1, titulo: "Gratis", icono: Icons.moneyIcon },
  ],
};

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

  Object.keys(rubrosBase).forEach((clave) => {
    const promedio = promediosMuseo[clave.toLowerCase()] || 0;
    const rubricas = rubrosBase[clave];
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
