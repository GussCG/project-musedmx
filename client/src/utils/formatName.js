export const formatName = ({
  user = null,
  nombre = "",
  apPaterno = "",
  apMaterno = "",
}) => {
  if (user) {
    return `${user.usr_nombre} ${user.usr_ap_paterno} ${user.usr_ap_materno}`;
  } else if (nombre || apPaterno || apMaterno) {
    return `${nombre} ${apPaterno} ${apMaterno}`;
  }
  return "Nombre no disponible";
};
