import Usuario from "../models/auth.model.js";
import { handleHttpError } from "../helpers/httpError.js";
import { hash, compare } from 'bcrypt';
// import { sendEmail } from "../services/emailService";
import jwt from 'jsonwebtoken';
import fs from "fs";
import path from "path";
import { uploadToAzure } from "../utils/azureUpload.js";

export const logIn = async (req, res) => {
  try {
    let { usr_correo, usr_contrasenia } = req.body;

    if (!usr_correo || !usr_contrasenia) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son requeridos",
      });
    }

    const usuario = await Usuario.findById(usr_correo);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!(await compare(usr_contrasenia, usuario.usr_contrasenia))) {
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

    // Subida de imagen a Azure Blob Storage
    let usr_foto = null;
    if (req.file) {
      const sanitizedEmail = usr_correo.replace(/[^a-zA-Z0-9]/g, "-");
      const blobName = `${sanitizedEmail}-imagenes/perfil/${req.file.filename}`;
      const containerName = "imagenes-usuarios";
      usr_foto = await uploadToAzure(containerName, req.file.path, blobName);
    }

    if (usr_tematicas) {
      usr_tematicas = JSON.parse(usr_tematicas); // Convertir a objeto JSON
    } else {
      usr_tematicas = [];
    }

    usr_contrasenia = await hash(usr_contrasenia, 10);

    console.log("Datos del usuario:", {
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

    const usuario = await Usuario.findById(correo);
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
    const correoDelToken = req.usuario.correo; // viene del token decodificado

    // Evita que editen a otro usuario
    if (correoDelToken !== req.body.usr_correo) {
      return res
        .status(403)
        .json({ message: "No autorizado para editar este usuario" });
    }

    if (req.body.usr_contrasenia) {
      req.body.usr_contrasenia = await hash(req.body.usr_contrasenia, 10);
    }

    // Obtener el usuario actual de la BD
    const usuarioActual = await Usuario.findById(req.body.usr_correo);

    // Validar si se subió una nueva imagen
    if (
      req.file &&
      usuarioActual.usr_foto &&
      usuarioActual.usr_foto !== req.file.filename
    ) {
      const rutaAnterior = path.join("uploads", usuarioActual.usr_foto);

      // Verifica que exista antes de borrar
      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior); // ❌ Borra la imagen anterior
        console.log("Imagen anterior eliminada:", usuarioActual.usr_foto);
      }

      req.body.usr_foto = req.file.filename; // ✅ Guardar la nueva en BD
    } else if (!req.file) {
      req.body.usr_foto = usuarioActual.usr_foto; // 🧠 Si no hay nueva, conservar la anterior
    }

    const usuario = await Usuario.updateUser(req.body.usr_correo, req.body);

    res.json({
      success: true,
      usuario,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_USER", error);
  }
};

export const verEmail = async (req, res) => {
	console.log(process.env.SMTP_HOST);
};

/* export const recuperarContrasena = (req, res) => {
	//Usar el servicio de envio de correos
	//El OTP se genera en el frontend

	sendEmail(req.body)
		.then((response) => res.send(response.message))
		.catch((error) => {
			handleHttpError(res, "ERROR_RECOVER_PASSWORD", error);
		});

	return res.status(200).json({
		success: true,
		message: "Email sent successfully"
	});	
} */