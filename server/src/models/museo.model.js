import { pool } from "../db.js";

export default class Museo {
  static async findAll({ search, tipos, alcaldias, sort, limit }) {
    let query = `
      SELECT m.*,
      (
        SELECT AVG(r.res_calif_estrellas)
        FROM resenia r
        WHERE r.visitas_vi_mus_id = m.mus_id
        AND r.res_aprobado = 1
      ) as mus_calificacion,
      (
        SELECT COUNT(r.res_id_res)
        FROM resenia r
        WHERE r.visitas_vi_mus_id = m.mus_id
        AND r.res_aprobado = 1
      ) as total_resenias
      FROM museos m
      WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
      query += ` AND (mus_nombre LIKE ? OR mus_descripcion LIKE ?) `;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (tipos && tipos.length > 0) {
      query += ` AND mus_tematica IN (${tipos.map(() => "?").join(",")}) `;
      queryParams.push(...tipos);
    }

    if (alcaldias && alcaldias.length > 0) {
      query += ` AND mus_alcaldia IN (${alcaldias.map(() => "?").join(",")}) `;
      queryParams.push(...alcaldias);
    }

    if (sort) {
      switch (sort) {
        case "name":
          query += ` ORDER BY mus_nombre DESC`;
          break;
        case "best-rating": // Pero la calificacion es
          query += ` ORDER BY mus_calificacion ASC`;
          break;
        case "worst-rating":
          query += ` ORDER BY mus_calificacion DESC`;
          break;
        default:
          query += ` ORDER BY mus_nombre ASC`;
          break;
      }
    }

    if (limit) {
      query += ` LIMIT ?`;
      queryParams.push(limit);
    }
    const [rows] = await pool.query(query, queryParams);
    return rows;
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
}
