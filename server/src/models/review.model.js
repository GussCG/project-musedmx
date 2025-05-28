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

	static async createReviewWithPhotos(data, fotos) {
		const conn =  await pool.getConnection();
		try {
			await conn.beginTransaction();

			// Insertar la reseña
			const insertReviewQuery = `INSERT INTO resenia (${Object.keys(data).join(", ")}) VALUES (${Object.keys(data).map(() => "?").join(", ")})`;
			const [reviewResult] = await conn.query(insertReviewQuery, Object.values(data));
			const reviewId = reviewResult.insertId;
			// Insertar fotos asociadas
			for (const foto of fotos) {
				const insertFotoQuery = `INSERT INTO foto_resenia (f_res_id_res, f_res_foto) VALUES (?, ?)`;
				await conn.query(insertFotoQuery, [reviewId, foto]);
			}

			await conn.commit();
			return { res_id_res: reviewId, ...data, fotos };
		} catch (error) {
			await conn.rollback();
			throw error;
		} finally {
			conn.release();
		}
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

	static async updateReview(id, data, fotos) {
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

      // Si hay fotos nuevas, reemplazar las viejas
      if (fotos && fotos.length > 0) {
        // Eliminar fotos antiguas
        await conn.query(`DELETE FROM foto_resenia WHERE f_res_id_res = ?`, [id]);

        // Insertar fotos nuevas
        for (const foto of fotos) {
          await conn.query(
            `INSERT INTO foto_resenia (f_res_id_res, f_res_foto) VALUES (?, ?)`,
            [id, foto]
          );
        }
      }

      await conn.commit();

      return { res_id_res: id, ...data, fotos };
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