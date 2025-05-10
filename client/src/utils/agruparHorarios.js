// Funcion para agrupar los horarios por dia

const diasSemana = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];

export const agruparHorarios = (horarios) => {
  let horariosAgrupados = {};
  // Se obtienen los horarios del museo de forma {Dia:Horario}
  let horariosArray = Object.entries(horarios);

  // Agrupamos los dias que tienen el mismo horario
  horariosArray.forEach(([dia, horario]) => {
    if (horariosAgrupados[horario]) {
      horariosAgrupados[horario].push(dia);
    } else {
      horariosAgrupados[horario] = [dia];
    }
  });

  // Ordenar los dias en el orden correcto de la semana
  Object.keys(horariosAgrupados).forEach((horario) => {
    horariosAgrupados[horario].sort(
      (a, b) => diasSemana.indexOf(a) - diasSemana.indexOf(b)
    );
  });

  // Formatear el resultado
  let resultado = Object.entries(horariosAgrupados)
    .map(([horario, dias]) => {
      // Si no tiene horario, no se muestra
      if (horario === "") {
        return "";
      }

      if (dias.length === 1) {
        return `${dias[0]}: ${horario}`;
      } else {
        let agrupados = [];
        let tempGroup = [dias[0]];

        // Agrupar los dias consecutivos
        for (let i = 1; i < dias.length; i++) {
          let diaActual = dias[i];
          let diaAnterior = dias[i - 1];

          if (
            diasSemana.indexOf(diaActual) ===
            diasSemana.indexOf(diaAnterior) + 1
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
