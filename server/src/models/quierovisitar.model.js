import { pool } from "../db.js";

export default class QV {
  static async agregarQV({ correo, museoId }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const queryInsert = `
      INSERT INTO quiero_visitar (qv_usr_correo, qv_mus_id)
      VALUES (?, ?)
    `;
      const valuesInsert = [correo, museoId];
      await connection.query(queryInsert, valuesInsert);

      // Obtener el museo agregado (con todos los datos)
      const querySelect = `
      SELECT * FROM museos WHERE mus_id = ?
    `;
      const valuesSelect = [museoId];
      const [museoResult] = await connection.query(querySelect, valuesSelect);

      await connection.commit();

      if (museoResult.length === 0) {
        throw new Error("Museo no encontrado después de agregar");
      }

      return museoResult[0]; // Devolver el objeto museo completo
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async eliminarQV({ correo, museoId }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
            DELETE FROM quiero_visitar
            WHERE qv_usr_correo = ? AND qv_mus_id = ?
            LIMIT 1
            `;
      const values = [correo, museoId];
      const [result] = await connection.query(query, values);

      return {
        success: true,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async obtenerQV({ correo }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
            SELECT m.*
            FROM quiero_visitar qv
            JOIN museos m ON qv.qv_mus_id = m.mus_id
            WHERE qv.qv_usr_correo = ?
            `;
      const values = [correo];
      const [result] = await connection.query(query, values);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
