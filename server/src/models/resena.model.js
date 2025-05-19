import { pool } from "../db.js";

export default class Resena {
  // Busca una reseña por su ID de reseña
  static async findById({ id }) {
    const query = `
        SELECT * FROM resenia
        WHERE res_id_res = ?
        `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  // Busca reseñas pendientes de un museo específico o de todos los museos
  static async findPendientes({ museoId = null }) {
    let query = `
      SELECT * FROM resenia
      WHERE res_aprobado = 0
    `;
    const queryParams = [];

    if (museoId !== null) {
      query += " AND visitas_vi_mus_id = ?";
      queryParams.push(museoId);
    }

    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findFoto({ id }) {
    const query = `
        SELECT * FROM foto_resenia
        WHERE f_res_id_res = ?
        `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }
}
