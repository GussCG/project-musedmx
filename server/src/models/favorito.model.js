import { pool } from "../db.js";

export default class Favorito {
  static async agregarFavorito({ correo, museoId }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
            INSERT INTO favoritos
                (fav_usr_correo, fav_mus_id)
            VALUES
                (?, ?)
            `;
      const values = [correo, museoId];
      const [result] = await connection.query(query, values);
      console.log(result);
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async eliminarFavorito({ correo, museoId }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
            DELETE FROM favoritos
            WHERE fav_usr_correo = ? AND fav_mus_id = ?
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

  static async verificarFavorito({ correo, museoId }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
            SELECT *
            FROM favoritos
            WHERE fav_usr_correo = ? AND fav_mus_id = ?
            LIMIT 1
            `;
      const values = [correo, museoId];
      const [result] = await connection.query(query, values);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
