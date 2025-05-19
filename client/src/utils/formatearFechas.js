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

export const formatearHora = (hora) => {
  // Asegurarse de que la hora tenga segundos (por si acaso)
  const horaCompleta = hora.length === 5 ? `${hora}:00` : hora;

  // Crear fecha ficticia (es solo un día placeholder)
  const fecha = new Date(`2004-04-30T${horaCompleta}`);

  // Opciones de formato
  const opciones = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("es-ES", opciones).format(fecha);
};

// Formatear fecha para la base de datos DATE -> YYYY-MM-DD
export const formatearFechaBDDATE = (fecha) => {
  const date = new Date(fecha);
  return date.toISOString().split("T")[0];
};

// Formatear fecha para la base de datos DATETIME -> YYYY-MM-DD HH:MM:SS
export const formatearFechaBDDATETIME = (fecha) => {
  const date = new Date(fecha);
  return date.toISOString().slice(0, 19).replace("T", " ");
};
