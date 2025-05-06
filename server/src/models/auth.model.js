import { pool } from "../db.js";

export default class Usuario {
	static async findById(usr_correo) {
		//Obtener los datos del usuario por su correo y las tematicas que tiene asignadas

		const query = `SELECT 
			u.*,    
			JSON_ARRAYAGG(uht.tematicas_tm_nombre) AS usr_tematicas
		FROM 
			musedmx.usuarios u
		JOIN 
			musedmx.usuarios_has_tematicas uht ON u.usr_correo = uht.usuarios_usr_correo
		WHERE 
			u.usr_correo = ?
		GROUP BY 
			u.usr_correo;`;

		const [rows] = await pool.query(query, [usr_correo]);
		return rows[0];
		// const [rows] = await pool.query("SELECT * FROM usuarios WHERE usr_correo = ?", [usr_correo]);
		// return rows[0];
	}
	static async signUp(data, tematicas) {
		let query = `INSERT INTO usuarios (` + Object.keys(data).join(", ") + `) VALUES (` + Object.keys(data).map(() => "?").join(", ") + `)`;
		const queryParams = Object.values(data);
		const [result] = await pool.query(query, queryParams);
		if (result.affectedRows === 0) {
			throw new Error("Error al crear el usuario");
		}
		let query2 = `INSERT INTO usuarios_has_tematicas (usuarios_usr_correo, tematicas_tm_nombre) VALUES `;
		query2 += `('${data.usr_correo}', ?), `.repeat(tematicas.length - 1) + `('${data.usr_correo}', ?);`;
		const [result2] = await pool.query(query2, [...tematicas, ...tematicas]);
		if (result2.affectedRows === 0) {
			throw new Error("Error al asignar temáticas al usuario");
		}
		return result;
	}

	static async updateUser(usr_correo, fields) {
		// Separar la lógica de actualización de usuario y temáticas
		// Actualizar el usuario quitando las temáticas
		const allowedFields = ["usr_nombre", "usr_ap_paterno", "usr_ap_materno", "usr_contrasenia", "usr_fecha_nac", "usr_telefono", "usr_foto"];
		const filteredFields = Object.keys(fields).reduce((acc, key) => {
			if (allowedFields.includes(key)) {
				acc[key] = fields[key];
			}
			return acc;
		}, {});

		const query = `UPDATE usuarios SET ` + Object.keys(filteredFields).map((key) => `${key} = ?`).join(", ") + " WHERE usr_correo = ?";
		const queryParams = [...Object.values(filteredFields), usr_correo];
		const [result] = await pool.query(query, queryParams);
		if (result.affectedRows === 0) {
			throw new Error("Usuario no encontrado");
		}
		
		if (fields.tematicas) {
			let query2 = `DELETE FROM usuarios_has_tematicas WHERE usuarios_usr_correo = ?`;
			await pool.query(query2, [usr_correo]);
			
			query2 = `INSERT INTO usuarios_has_tematicas VALUES `;
			query2 += `('${usr_correo}', ?), `.repeat(fields.tematicas.length - 1) + `('${usr_correo}', ?);`;
			await pool.query(query2, [...fields.tematicas, ...fields.tematicas]);
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