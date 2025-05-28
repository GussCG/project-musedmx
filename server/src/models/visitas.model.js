import { pool } from "../db.js";
export default class Visitas {
  // Obtiene todas las visitas de un usuario
  static async find(correo) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
        SELECT *
        FROM visitas
        WHERE vi_usr_correo = ?
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

  static async add({ correo, museoId, fechaHora }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
        INSERT INTO visitas
          (vi_usr_correo, vi_mus_id, vi_fechahora)
        VALUES
          (?, ?, ?)
      `;
      const values = [correo, museoId, fechaHora];
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

  static async delete({ correo, museoId }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
        DELETE FROM visitas
        WHERE vi_usr_correo = ? AND vi_mus_id = ?
        LIMIT 1
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
}