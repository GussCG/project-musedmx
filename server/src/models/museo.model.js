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

    // query += `LIMIT ? OFFSET ?`;
    // queryParams.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async countAll({ search }) {
    let query = `
    SELECT COUNT(*) as total FROM museos 
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
