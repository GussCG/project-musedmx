export const formatearDireccion = (museo) => {
  const { calle, num_ext, colonia, alcaldia, cp } = museo;
  let direccionFormateada = "";
  if (calle) {
    direccionFormateada += calle;
  }
  if (num_ext) {
    direccionFormateada += ` ${num_ext}`;
  }
  if (colonia) {
    direccionFormateada += `, ${colonia}`;
  }
  if (alcaldia) {
    direccionFormateada += `, ${alcaldia}`;
  }
  if (cp) {
    direccionFormateada += `, ${cp}`;
  }
  return direccionFormateada.trim();
};
