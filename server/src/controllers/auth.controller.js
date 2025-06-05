import Usuario from "../models/auth.model.js";
import { handleHttpError } from "../helpers/httpError.js";
import bcrypt from "bcrypt";
import sharp from "sharp";
import { sendRecoveryEmail } from "../services/emailService.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { generateOTP } from "../utils/generateOTP.js";
import { uploadToAzure } from "../utils/azureUpload.js";
import OTP from "../models/otp.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logIn = async (req, res) => {
  try {
    let { usr_correo, usr_contrasenia } = req.body;

    if (!usr_correo || !usr_contrasenia) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son requeridos",
      });
    }

    const usuario = await Usuario.findOne({ usr_correo });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar si el usuario está verificado
    if (!usuario.usr_verificado) {
      return res.status(403).json({
        success: false,
        message: "Tu cuenta no ha sido verificada.",
      });
    }

    if (!(await bcrypt.compare(usr_contrasenia, usuario.usr_contrasenia))) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        correo: usuario.usr_correo,
        tipo: usuario.usr_tipo,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // Guardar el token en una cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Cambiar a true en producción
      sameSite: "Lax", // Cambiar a 'None' si se usa HTTPS
    });

    res.status(200).json({
      success: true,
      message: "Usuario logueado",
      usuario,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_LOGIN_USER", error);
  }
};

export const signUp = async (req, res) => {
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
      usr_tematicas,
      usr_foto,
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

    if (req.file) {
      const sanitizedEmail = usr_correo.replace(/[^a-zA-Z0-9]/g, "-");
      const containerName = "imagenes-usuarios";
      const bufferJpg = await sharp(req.file.buffer)
        .jpeg({ quality: 80 })
        .toBuffer();

      const blobName = `${sanitizedEmail}-imagenes/perfil/perfil.jpg`;

      const nuevaFotoUrl = await uploadToAzure(
        containerName,
        bufferJpg,
        blobName,
        "image/jpeg"
      );

      usr_foto = nuevaFotoUrl;
    }

    if (usr_tematicas) {
      usr_tematicas = JSON.parse(usr_tematicas); // Convertir a objeto JSON
    } else {
      usr_tematicas = [];
    }

    usr_contrasenia = await bcrypt.hash(usr_contrasenia, 10);

    const usuario = await Usuario.create({
      usr_correo,
      usr_nombre,
      usr_ap_paterno,
      usr_ap_materno,
      usr_contrasenia,
      usr_fecha_nac,
      usr_telefono,
      usr_foto,
      usr_tipo,
      usr_tematicas,
    });

    res.status(201).json({
      success: true,
      message: "Usuario creado",
      usuario,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_USER", error);
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token"); // Limpiar la cookie del token
    res.status(200).json({
      success: true,
      message: "Sesión cerrada",
    });
  } catch (error) {
    handleHttpError(res, "ERROR_LOGOUT_USER", error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const usuario = await Usuario.deleteUser(req.body.usr_correo);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    res.json({
      success: true,
      message: "Usuario eliminado",
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_USER", error);
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { correo } = req.usuario; // Viene del token decodificado en el middleware

    const usuario = await Usuario.findOne({ usr_correo: correo });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const correoParam = req.params.usr_correo; // Correo del usuario a editar
    const correoToken = req.usuario.correo; // viene del token decodificado

    // Evita que editen a otro usuario
    if (correoToken !== correoParam) {
      return res
        .status(403)
        .json({ message: "No autorizado para editar este usuario" });
    }

    // Obtener el usuario actual de la BD
    const usuarioActual = await Usuario.findOne({ usr_correo: correoParam });
    if (!usuarioActual) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const datosActualizar = {};

    if (req.body.usr_contrasenia) {
      req.body.usr_contrasenia = await hash(req.body.usr_contrasenia, 10);
    }
    if (req.body.usr_nombre) datosActualizar.usr_nombre = req.body.usr_nombre;
    if (req.body.usr_ap_paterno)
      datosActualizar.usr_ap_paterno = req.body.usr_ap_paterno;
    if (req.body.usr_ap_materno)
      datosActualizar.usr_ap_materno = req.body.usr_ap_materno;
    if (req.body.usr_fecha_nac)
      datosActualizar.usr_fecha_nac = req.body.usr_fecha_nac;
    if (req.body.usr_telefono)
      datosActualizar.usr_telefono = req.body.usr_telefono;
    if (req.body.usr_tipo) datosActualizar.usr_tipo = req.body.usr_tipo;
    if (req.body.usr_tematicas) {
      datosActualizar.usr_tematicas = JSON.parse(req.body.usr_tematicas);
    }

    if (req.file) {
      const sanitizedEmail = correoParam.replace(/[^a-zA-Z0-9]/g, "-");
      const containerName = "imagenes-usuarios";
      const bufferJpg = await sharp(req.file.buffer)
        .jpeg({ quality: 80 })
        .toBuffer();

      const blobName = `${sanitizedEmail}-imagenes/perfil/perfil.jpg`;

      const nuevaFotoUrl = await uploadToAzure(
        containerName,
        bufferJpg,
        blobName,
        "image/jpeg"
      );

      datosActualizar.usr_foto = nuevaFotoUrl;
    }

    const usuario = await Usuario.updateUser(correoParam, datosActualizar);

    res.status(200).json({
      usuario,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_USER", error);
  }
};

export const verEmail = async (req, res) => {
  console.log(process.env.SMTP_HOST);
};

export const obtenerUsuarioByCorreo = async (req, res) => {
  try {
    const { usr_correo } = req.params;
    const usuario = await Usuario.findOne({ usr_correo });
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    res.status(200).json({
      success: true,
      usuario,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_USER", error);
  }
};

export const recuperarContrasena = async (req, res) => {
  try {
    const { usr_correo } = req.body;
    if (!usr_correo) {
      return res.status(400).json({
        success: false,
        message: "Correo electrónico es requerido",
      });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ usr_correo });
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const otpExistente = await OTP.findOneByCorreo({
      usr_correo,
    });

    let OTPCode;
    if (otpExistente) {
      OTPCode = otpExistente.otp_codigo;
    } else {
      // Generar un nuevo OTP
      OTPCode = await generateOTP();
      await OTP.create({ usr_correo, otp: OTPCode });
    }

    console.log("OTP generado:", OTPCode);

    await sendRecoveryEmail({ recipient_email: usr_correo, OTP: OTPCode });

    res.status(200).json({
      success: true,
      message: "Correo de recuperación enviado",
      otp: OTPCode, // Para propósitos de prueba, no enviar en producción
    });
  } catch (error) {
    handleHttpError(res, "ERROR_RECOVER_PASSWORD", error);
  }
};

export const updateContrasena = async (req, res) => {
  try {
    const { usr_correo, usr_contrasenia } = req.body;

    if (!usr_correo || !usr_contrasenia) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son requeridos",
      });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ usr_correo });
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Actualizar la contraseña
    const hashedPassword = await bcrypt.hash(usr_contrasenia, 10);
    usuario.usr_contrasenia = hashedPassword;
    await Usuario.updateUser(usr_correo, {
      usr_contrasenia: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_PASSWORD", error);
  }
};
