import Usuario from "../models/auth.model.js";
import { handleHttpError } from "../helpers/httpError.js";
import { hash, compare } from 'bcrypt';

export const logIn = async (req, res) => {
	try {
		const { 
			usr_correo, 
			usr_contrasenia 
		} = req.body;

		if (!usr_correo || !usr_contrasenia) {
			return res.status(400).json({
				success: false,
				message: "Faltan datos obligatorios",
			});
		}

		const usuario = await Usuario.findById(usr_correo);
		if (!usuario) {
			return res.status(404).json({
				success: false,
				message: "Usuario no encontrado",
			});
		}

		if (!await compare(usr_contrasenia, usuario.usr_contrasenia)) {
			return res.status(401).json({
				success: false,
				message: "Contraseña incorrecta",
			});
		}
		// Aquí se puede generar un token JWT
		res.json({
			success: true,
			message: "Inicio de sesión exitoso",
			usuario,
		});
	} catch (error) {
		handleHttpError(res, "ERROR_LOGIN_USER", error);
	}
};

export const signUp = async (req, res) => {
	try {
		const datos = req.body;
		
		if (!datos.usr_correo || !datos.usr_nombre || !datos.usr_ap_paterno || !datos.usr_contrasenia || !datos.usr_fecha_nac || !datos.usr_tipo) {
			return res.status(400).json({
				success: false,
				message: "Faltan datos obligatorios",
			});
		}
		datos.usr_contrasenia = await hash(datos.usr_contrasenia, 10);
		const usuario = await Usuario.signUp(datos);
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
	// Si usamos JWT, se hace blacklist, si son sesiones, destruirlas
	try {
		res.json({
			success: true,
			message: "Logout exitoso",
		});
	} catch (error) {
		handleHttpError(res, "ERROR_LOGOUT_USER", error);
	}
};

export const updateUser = async (req, res) => {
	try {
		if (req.body.usr_contrasenia) {
			req.body.usr_contrasenia = await hash(req.body.usr_contrasenia, 10);
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
}