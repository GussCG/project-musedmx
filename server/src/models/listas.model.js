import { pool } from "../db.js";

const tableSchemas = {
  favoritos: ['fav_usr_correo', 'fav_mus_id'],
  quiero_visitar: ['qv_usr_correo', 'qv_mus_id'],
  visitas: ['vi_usr_correo', 'vi_mus_id', 'vi_fechahora'],
};

export default class List {
  static async find(table, id) {
	let col = tableSchemas[table][0];
	let query = `
		SELECT * FROM ${table} 
		WHERE ${col} = ?
		`;
	const queryParams = [id];
	const [result] = await pool.query(query, queryParams);
	if (result.length === 0) {
	  throw new Error("No se encontraron resultados");
	}
	return result;
  }

  static async add(table, data) {
	let query = `
		INSERT INTO ${table} 
		(` 
			+ Object.keys(data).join(", ") + 
		`) 
		VALUES 
		(` 
			+ Object.keys(data).map(() => "?").join(", ") + 
		`)
		`;
	const queryParams = Object.values(data);
	const [result] = await pool.query(query, queryParams);
	if (result.affectedRows === 0) {
	  throw new Error("Error al agregar el elemento a la lista");
	}
	return result;
  }

  static async delete(table, data) {
	let col_correo = tableSchemas[table][0];
	let col_mus_id = tableSchemas[table][1];
	let query = `
		DELETE FROM ${table} 
		WHERE ${col_correo} = ? 
		AND ${col_mus_id} = ?
		`;
	// const queryParams = [...Object.values(data)];
	const queryParams = [data[col_correo], data[col_mus_id]];
	const [result] = await pool.query(query, queryParams);
	if (result.affectedRows === 0) {
	  throw new Error("Error al eliminar el elemento de la lista");
	}
	return result;
  }
}