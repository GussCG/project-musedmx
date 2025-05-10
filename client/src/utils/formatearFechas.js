export const formatearFecha = (fecha) => {
  const opciones = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const fechaFormateada = new Date(fecha).toLocaleString("es-MX", opciones);
  return fechaFormateada;
};

export const formatearFechaSinHora = (fecha) => {
  const opciones = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const fechaFormateada = new Date(fecha).toLocaleString("es-MX", opciones);
  return fechaFormateada;
};

export const formatearFechaTitulo = (fecha) => {
  const opciones = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  const fechaFormateada = new Date(fecha).toLocaleString("es-MX", opciones);
  return fechaFormateada;
};
