export const formatName = ({
  user = null,
  nombre = "",
  apPaterno = "",
  apMaterno = "",
}) => {
  if (user) {
    const { usr_nombre = "", usr_ap_paterno = "", usr_ap_materno = "" } = user;
    return [usr_nombre, usr_ap_paterno, usr_ap_materno]
      .filter(Boolean)
      .join(" ");
  }

  return (
    [nombre, apPaterno, apMaterno].filter(Boolean).join(" ") ||
    "Nombre no disponible"
  );
};
