export const formatAge = (user) => {
  const birthdate = new Date(user.usr_fecha_nac);
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();
  const month = today.getMonth() - birthdate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
    return age - 1;
  }
  return age;
};
