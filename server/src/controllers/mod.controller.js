import Mod from "../models/mod.model.js";
import { handleHttpError, createError } from "../helpers/httpError.js";
import bcrypt from "bcrypt";

export const obtenerModeradores = async (req, res) => {
  try {
    const moderadores = await Mod.findAll();
    res.status(200).json(moderadores);
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MODERADORES");
  }
};

export const createMod = async (req, res) => {
  try {
    let {
      usr_correo,
      usr_nombre,
      usr_ap_paterno,
      usr_ap_materno,
      usr_contrasenia,
      usr_fecha_nac,
      usr_telefono,
      usr_tipo,
    } = req.body;

    if (
      !usr_correo ||
      !usr_nombre ||
      !usr_ap_paterno ||
      !usr_contrasenia ||
      !usr_fecha_nac ||
      !usr_tipo
    ) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos obligatorios",
      });
    }

    usr_contrasenia = await bcrypt.hash(usr_contrasenia, 10);

    const moderador = await Mod.create({
      usr_correo,
      usr_nombre,
      usr_ap_paterno,
      usr_ap_materno,
      usr_contrasenia,
      usr_fecha_nac,
      usr_telefono,
      usr_tipo,
    });

    console.log("Moderador creado:", moderador);

    res.status(201).json({
      moderador,
    });
  } catch (error) {
    // Aquí detectamos si es error por correo duplicado
    if (error.message === "El correo ya está registrado") {
      return createError(res, "CORREO_DUPLICADO", error);
    }

    // Otro tipo de error interno
    handleHttpError(res, "ERROR_CREATE_MODERADOR", error);
  }
};

export const updateMod = async (req, res) => {
  try {
    const { usr_correo } = req.params;
    const datosActualizar = {};

    if (req.body.usr_nombre) datosActualizar.usr_nombre = req.body.usr_nombre;
    if (req.body.usr_ap_paterno)
      datosActualizar.usr_ap_paterno = req.body.usr_ap_paterno;
    if (req.body.usr_ap_materno)
      datosActualizar.usr_ap_materno = req.body.usr_ap_materno;
    if (req.body.usr_contrasenia) {
      datosActualizar.usr_contrasenia = await bcrypt.hash(
        req.body.usr_contrasenia,
        10
      );
    }
    if (req.body.usr_fecha_nac)
      datosActualizar.usr_fecha_nac = req.body.usr_fecha_nac;
    if (req.body.usr_telefono)
      datosActualizar.usr_telefono = req.body.usr_telefono;

    console.log("Datos a actualizar:", datosActualizar);

    const modActual = await Mod.findByCorreo(usr_correo);
    if (!modActual) {
      return res.status(404).json({ message: "Moderador no encontrado" });
    }

    const resultado = await Mod.update(usr_correo, datosActualizar);
    res.status(200).json({
      resultado,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_MODERADOR", error);
  }
};

export const deleteMod = async (req, res) => {
  try {
    const { usr_correo } = req.params;
    const result = await Mod.delete(usr_correo);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Moderador no encontrado" });
    }
    res.status(200).json({ message: "Moderador eliminado correctamente" });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_MODERADOR");
  }
};

export const verifyMod = async (req, res) => {
  try {
    const { usr_correo } = req.params;
    const moderador = await Mod.findByCorreo(usr_correo);
    if (!moderador) {
      return res.status(404).json({ message: "Moderador no encontrado" });
    }
    res.status(200).json(moderador);
  } catch (error) {
    handleHttpError(res, "ERROR_VERIFY_MODERADOR", error);
  }
};
