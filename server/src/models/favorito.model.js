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
      await connection.commit();
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

      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getFavoritosByCorreo({ correo }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
          SELECT m.*
          FROM favoritos f
          JOIN museos m ON f.fav_mus_id = m.mus_id
          WHERE f.fav_usr_correo = ?
          `;
      const values = [correo];
      const [result] = await connection.query(query, values);

      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getFavoritosCountByMuseoId({ museoId }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
            SELECT COUNT(*) AS count
            FROM favoritos
            WHERE fav_mus_id = ?
            `;
      const values = [museoId];
      const [result] = await connection.query(query, values);

      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
