import * as Yup from "yup";

export const museoSchema = Yup.object({
  museofrmnombre: Yup.string()
    .matches(/^[a-zA-Z0-9\s().:,áéíóúÁÉÍÓÚñÑ]+$/, "Caracteres no válidos")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres")
    .required("Campo requerido"),
  museofrmcalle: Yup.string()
    .matches(/^[a-zA-Z0-9\s().:,áéíóúÁÉÍÓÚñÑ]+$/, "Caracteres no válidos")
    .min(3, "La calle debe tener al menos 3 caracteres")
    .max(100, "La calle no puede exceder los 100 caracteres")
    .required("Campo requerido"),
  museofrmnumext: Yup.string()
    .matches(
      /^([0-9]+|s\/n)$/i,
      "El número exterior solo puede contener números o 's/n'"
    )
    .min(1, "El número exterior debe tener al menos 1 dígito")
    .max(10, "El número exterior no puede exceder los 10 dígitos")
    .required("Campo requerido"),
  museofrmcolonia: Yup.string()
    .matches(/^[a-zA-Z0-9\s().:,áéíóúÁÉÍÓÚñÑ]+$/, "Caracteres no válidos")
    .min(3, "La colonia debe tener al menos 3 caracteres")
    .max(100, "La colonia no puede exceder los 100 caracteres")
    .required("Campo requerido"),
  museofrmcp: Yup.string()
    .matches(
      /^[0-9]{5}$/,
      "El código postal debe tener 5 dígitos y solo números"
    )
    .max(5, "El código postal debe tener 5 dígitos")
    .required("Campo requerido"),
  museofrmalcaldia: Yup.string().required("Campo requerido"),
  museofrmtematicamuseo: Yup.string().required("Campo requerido"),
  museofrmdescripcion: Yup.string()
    .required("Campo requerido")
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  museofrmglatitud: Yup.number()
    .required("Campo requerido")
    .typeError("La latitud debe ser un número"),
  museofrmglongitud: Yup.number()
    .required("Campo requerido")
    .typeError("La longitud debe ser un número"),
});
