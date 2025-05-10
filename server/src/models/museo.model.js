import { pool } from "../db.js";

export default class Museo {
  static async findAll({ search }) {
    let query = `
      SELECT * FROM museos 
      WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
      query += ` AND (mus_nombre LIKE ? OR mus_descripcion LIKE ?) `;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const [[result]] = await pool.query(query, queryParams);
    return result.total;
  }

  static async findAllNames() {
    const query = `
      SELECT 
        mus_id, mus_nombre 
      FROM museos
      ORDER BY RAND()
      `;
    const [rows] = await pool.query(query, []);
    return rows;
  }

  static async findById({ id }) {
    const query = `
      SELECT * from museos 
      WHERE mus_id = ?
      LIMIT 1
      `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows[0];
  }

  static async create(museoData) {
  	let query = `INSERT INTO museos (` + Object.keys(museoData).join(", ") + `) VALUES (` + Object.keys(museoData).map(() => "?").join(", ") + `)`;
  	const queryParams = Object.values(museoData);
  	const [result] = await pool.query(query, queryParams);
  	if (result.affectedRows === 0) {
  		throw new Error("Error al crear el museo");
  	}
  	return result;
  }

  static async findGaleriaById({ id }) {
    const query = `
      SELECT * FROM galeria
      WHERE gal_mus_id = ?
      ORDER BY RAND()
      LIMIT 10
      `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findGaleriaById({ id }) {
    const query = `
      SELECT * FROM galeria
      WHERE gal_mus_id = ?
      ORDER BY RAND()
      LIMIT 10
      `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }


  //Las cochinadas de Diego
	static async updateMuseo(id, museoData) {
		const query = `UPDATE museos SET ` + Object.keys(museoData).map(key => `${key} = ?`).join(', ') + ` WHERE mus_id = ?`;
		const [result] = await pool.query(query, [...Object.values(museoData), id]);
		if (result.affectedRows === 0) {
			throw new Error("Museo no encontrado o no se realizaron cambios");
		}
		return result;
	}

	static async deleteMuseo(id) {
		const query = `DELETE FROM museos WHERE mus_id = ?`;
		const [rows] = await pool.query(query, [id]);
		if (rows.affectedRows === 0) {
			throw new Error("Museo no encontrado");
		}
		return { 
			message: "Museo eliminado",
		};
	}
}