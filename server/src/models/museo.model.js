import { pool } from "../db.js";

export default class Museo {
  // Función para obtener todos los museos con filtros opcionales
  // search: nombre o descripcion del museo
  // tipo: tematica del museo
  static async findAll() {
    let query = "SELECT * FROM museos";

    // Si es por tipo (Todos, Cerca o Populares)
    // Se hace luego

    const [rows] = await pool.query(query, []);
    return rows;
  }

  static async findWithFilters({
    search = null,
    tematicas = [],
    alcaldias = [],
    precioMin = 0,
    precioMax = 100,
  }) {
    let query = `SELECT * FROM museos WHERE 1=1`;
    const queryParams = [];

    if (search) {
      query += ` AND (mus_nombre LIKE ? OR mus_descripcion LIKE ?) `;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (tematicas.length > 0) {
      query += ` AND mus_tematica IN (${tematicas.map(() => "?").join(", ")})`;
      queryParams.push(...tematicas);
    }

    if (alcaldias.length > 0) {
      query += ` AND mus_alcaldia IN (${alcaldias.map(() => "?").join(", ")})`;
      queryParams.push(...alcaldias);
    }

    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findAllNames() {
    const query = `SELECT mus_id, mus_nombre FROM museos`;
    const [rows] = await pool.query(query, []);
    return rows;
  }

  //   static async create(museoData) {

  //   }

  static async findById(id) {
	const query = `SELECT * FROM museos WHERE mus_id = ?`;
	const [rows] = await pool.query(query, [id]);
	if (rows.length === 0) {
	  throw new Error("Museo no encontrado");
	}
	return rows;
  }

  //* No sé si está bien :c
  static async update(id, museoData) {
	const query = `UPDATE museos SET ? WHERE mus_id = ?`;
	await pool.query(query, [museoData, id]);
	return { message: "Museo actualizado" };
  }

  static async delete(id) {
	const query = `DELETE FROM museos WHERE mus_id = ?`;
	const [rows] = await pool.query(query, [id]);
	if (rows.affectedRows === 0) {
	  throw new Error("Museo no encontrado");
	}
	return { message: "Museo eliminado" };
  }
}