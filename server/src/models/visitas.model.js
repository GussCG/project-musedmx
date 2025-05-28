import { pool } from "../db.js";

export default class Visitas {
  static async find(vi_usr_correo) {
    let query = `
      SELECT * FROM visitas
      WHERE vi_usr_correo = ?
      `;
    const queryParams = [vi_usr_correo];
    const [result] = await pool.query(query, queryParams);
    if (result.length === 0) {
      throw new Error("No se encontraron resultados");
    }
    return result;
  }

  static async add({ vi_fechahora, vi_usr_correo, vi_mus_id }) {
    let query = `
      INSERT INTO visitas
      (
        vi_fechahora,
        vi_usr_correo,
        vi_mus_id
      )
      VALUES
      (
        ?,
        ?,
        ?
      )
    `;
    const queryParams = [vi_fechahora, vi_usr_correo, vi_mus_id];
    const [result] = await pool.query(query, queryParams);
    if (result.affectedRows === 0) {
      throw new Error("Error al agregar la visita");
    }
    return result;
  }

  static async delete({ vi_usr_correo, vi_mus_id }) {
    let query = `
      DELETE FROM visitas
      WHERE vi_usr_correo = ?
      AND vi_mus_id = ?
      `;
    const queryParams = [vi_usr_correo, vi_mus_id];
    const [result] = await pool.query(query, queryParams);
    if (result.affectedRows === 0) {
      throw new Error("Error al eliminar el elemento de la lista");
    }
    return result;
  }
}
