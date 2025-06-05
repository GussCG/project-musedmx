import OTP from "../models/otp.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { handleHttpError } from "../helpers/httpError.js";
import Usuario from "../models/auth.model.js";
import { sendOTPEmail } from "../services/emailService.js";

export const generarOTP = async (req, res) => {
  try {
    const { usr_correo } = req.body;
    const otp = await generateOTP();

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ usr_correo });
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar si el usuario ya está verificado
    if (usuario.usr_verificado) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya está verificado",
      });
    }

    // Guardar el OTP en la base de datos
    const otpData = await OTP.create({
      usr_correo,
      otp,
    });
    if (!otpData) {
      return res.status(500).json({
        success: false,
        message: "Error al generar OTP",
      });
    }

    // Enviar el OTP al correo del usuario
    if (otpData.success) {
      await sendOTPEmail({
        recipient_email: usr_correo,
        OTP: otp,
      });
      return res.status(200).json({
        success: true,
        message:
          "Correo enviado con éxito, por favor revisa tu bandeja de entrada",
        data: {
          usr_correo,
          otp,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error al crear OTP",
      });
    }
  } catch (error) {
    handleHttpError(res, "ERROR_GENERATE_OTP", error);
  }
};

export const verificarOTP = async (req, res) => {
  try {
    const { usr_correo, otp } = req.body;

    const otpValido = await OTP.findOne({ usr_correo, otp });

    if (!otpValido) {
      return res.status(400).json({
        success: false,
        message: "OTP inválido o expirado",
      });
    }

    const usuarioActualizado = await Usuario.markAsVerified({ usr_correo });

    if (!usuarioActualizado) {
      return res.status(500).json({
        success: false,
        message: "Error al verificar el usuario",
      });
    }

    await OTP.deleteOne({ usr_correo, otp });
    res.status(200).json({
      success: true,
      message: "Usuario verificado exitosamente",
    });
  } catch (error) {
    handleHttpError(res, "ERROR_VERIFY_OTP", error);
  }
};
