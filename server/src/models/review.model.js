import { pool } from "../db.js";

export default class Review {
  static async findAll(options = {}) {
    let query = "SELECT * FROM reviews";
    let params = [];

    if (options.where) {
      const whereClauses = [];
      for (const [key, value] of Object.entries(options.where)) {
        whereClauses.push(`${key} = ?`);
        params.push(value);
      }
      if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
      }
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async createReview(data) {
    const query = `
      INSERT INTO resenia (
        ${Object.keys(data).join(", ")}
      ) VALUES (
        ${Object.keys(data).map(() => "?").join(", ")}
      )`;
    const queryParams = Object.values(data);
    const [res] = await pool.query(query, queryParams);
    console.log("Review created with ID:", res.insertId);
    return res;
  }

  static async updateReviewImages(idresena, photosURLs) {
    const conn =  await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Eliminar fotos antiguas
      await conn.query(`DELETE FROM foto_resenia WHERE f_res_id_res = ?`, [idresena]);

      // Insertar fotos nuevas
      for (const foto of photosURLs) {
        const insertFotoQuery = `INSERT INTO foto_resenia (f_res_id_res, f_res_foto) VALUES (?, ?)`;
        await conn.query(insertFotoQuery, [idresena, foto]);
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async updateReview(id, data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Actualizar datos en resenia
      const setClause = Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(", ");
      const params = [...Object.values(data), id];
      const updateQuery = `UPDATE resenia SET ${setClause} WHERE res_id_res = ?`;
      await conn.query(updateQuery, params);

      await conn.commit();

      return { res_id_res: id, ...data };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM resenia WHERE res_id_res = ?";
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async deleteReview(id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Eliminar fotos asociadas
      const deleteFotosQuery = "DELETE FROM foto_resenia WHERE f_res_id_res = ?";
      await conn.query(deleteFotosQuery, [id]);

      // Eliminar la reseña
      const deleteReviewQuery = "DELETE FROM resenia WHERE res_id_res = ?";
      await conn.query(deleteReviewQuery, [id]);

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}