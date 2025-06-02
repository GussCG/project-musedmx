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

  // Obtiene cuantos museos ha visitado un usuario
  static async getVisitasCount(correo) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
        SELECT COUNT(DISTINCT vi_mus_id) AS museos_visitados
        FROM visitas
        WHERE vi_usr_correo = ?
			`;
      const [result] = await connection.query(query, [correo]);
      await connection.commit();
      return result[0].museos_visitados;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Obtiene el total de museos
  static async getTotalMuseos() {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
        SELECT COUNT(*) AS total_museos
        FROM museos
			`;
      const [result] = await connection.query(query);
      await connection.commit();
      return result[0].total_museos;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async verifyVisita({ vi_usr_correo, vi_mus_id }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
        SELECT * FROM visitas
        WHERE vi_usr_correo = ? AND vi_mus_id = ?
      `;
      const queryParams = [vi_usr_correo, vi_mus_id];
      const [result] = await connection.query(query, queryParams);
      if (result.length > 0) {
        await connection.commit();
        return true; // Visita existe
      } else {
        await connection.rollback();
        return false; // Visita no existe
      }
    } catch (error) {
      await connection.rollback();
      console.error("Error al verificar visita:", error);
      throw new Error("Error al verificar visita");
    }
  }
}
