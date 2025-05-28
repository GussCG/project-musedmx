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

  static async delete({ vi_usr_correo, vi_mus_id, vi_fechahora }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    console.log("Eliminando visita:", {
      vi_usr_correo,
      vi_mus_id,
      vi_fechahora,
    });
    try {
      let query = `
        DELETE FROM visitas
        WHERE vi_usr_correo = ? AND vi_mus_id = ? AND vi_fechahora = ?
      `;
      const queryParams = [vi_usr_correo, vi_mus_id, vi_fechahora];
      const [result] = await connection.query(query, queryParams);

      if (result.affectedRows === 0) {
        throw new Error("No se encontró la visita para eliminar");
      }
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      console.error("Error al eliminar la visita:", error);
      throw new Error("Error al eliminar la visita");
    } finally {
      connection.release();
    }
  }
}
