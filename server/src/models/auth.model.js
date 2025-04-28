import { pool } from "../db.js";

export default class Usuario {
	static async findById(usr_correo) {
		const [rows] = await pool.query("SELECT * FROM usuarios WHERE usr_correo = ?", [usr_correo]);
		return rows[0];
	}
	static async signUp(data) {
		let query = `INSERT INTO usuarios (` + Object.keys(data).join(", ") + `) VALUES (` + Object.keys(data).map(() => "?").join(", ") + `)`;
		const queryParams = Object.values(data);
		const [result] = await pool.query(query, queryParams);
		if (result.affectedRows === 0) {
			throw new Error("Error al crear el usuario");
		}
		return result;
		
	}

	static async updateUser(usr_correo, fields) {
		const query = `UPDATE usuarios SET ` + Object.keys(fields).map((key) => `${key} = ?`).join(", ") + " WHERE usr_correo = ?";
		const queryParams = [...Object.values(fields), usr_correo];
		const [result] = await pool.query(query, queryParams);
		if (result.affectedRows === 0) {
			throw new Error("Usuario no encontrado");
		}
		return result;
	}

	static async deleteUser(usr_correo) {
		const query = `DELETE FROM usuarios WHERE usr_correo = ?`;
		const [result] = await pool.query(query, [usr_correo]);
		if (result.affectedRows === 0) {
			throw new Error("Usuario no encontrado");
		}
		return result;
	}
}