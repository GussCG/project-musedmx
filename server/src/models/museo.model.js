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

  static async findById({ id }) {
    const query = `SELECT * from museos WHERE mus_id = ?`;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  //   static async create(museoData) {

  //   }
}
