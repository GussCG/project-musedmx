// Funcion para agrupar los horarios por dia
import { DIAS_SEMANA } from "../constants/catalog";

export const agruparHorarios = (horarios) => {
  let horariosAgrupados = {};

  // Se obtienen los horarios del museo de forma {Dia:Horario}
  let horariosArray = Object.entries(horarios);

  // Agrupamos los dias que tienen el mismo horario
  horariosArray.forEach(([dia, horarioObj]) => {
    const horario = `${horarioObj.mh_hora_inicio} - ${horarioObj.mh_hora_fin}`; // Usamos el formato de hora inicio y fin

    // Convertir el número de día a su nombre
    const nombreDia = DIAS_SEMANA[dia];

    if (horariosAgrupados[horario]) {
      horariosAgrupados[horario].push(nombreDia);
    } else {
      horariosAgrupados[horario] = [nombreDia];
    }
  });

  // Convertir el objeto DIAS_SEMANA en un array de los días de la semana
  const diasSemanaArray = Object.values(DIAS_SEMANA);

  // Ordenar los días en el orden correcto de la semana
  Object.keys(horariosAgrupados).forEach((horario) => {
    horariosAgrupados[horario].sort(
      (a, b) => diasSemanaArray.indexOf(a) - diasSemanaArray.indexOf(b)
    );
  });

  // Formatear el resultado
  let resultado = Object.entries(horariosAgrupados)
    .map(([horario, dias]) => {
      // Si el horario es 00:00:00 - 00:00:00, lo ignoramos
      if (horario === "00:00:00 - 00:00:00") {
        return "";
      }

      if (dias.length === 1) {
        return `${dias[0]}: ${horario}`;
      } else {
        let agrupados = [];
        let tempGroup = [dias[0]];

        // Agrupar los días consecutivos
        for (let i = 1; i < dias.length; i++) {
          let diaActual = dias[i];
          let diaAnterior = dias[i - 1];

          if (
            diasSemanaArray.indexOf(diaActual) ===
            diasSemanaArray.indexOf(diaAnterior) + 1
          ) {
            tempGroup.push(diaActual);
          } else {
            agrupados.push(tempGroup);
            tempGroup = [diaActual];
          }
        }
        agrupados.push(tempGroup);

        // Formatear la salida correctamente
        return (
          agrupados
            .map((grupo) => {
              return grupo.length === 1
                ? `${grupo[0]}`
                : `${grupo[0]} - ${grupo[grupo.length - 1]}`;
            })
            .join(", ") + `: ${horario}`
        );
      }
    })
    .join("\n");

  return resultado.split("\n");
};
