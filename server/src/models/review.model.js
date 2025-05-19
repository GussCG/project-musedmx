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
		const query = `INSERT INTO resenia (` + Object.keys(data).join(", ") + `) VALUES (` + Object.keys(data).map(() => "?").join(", ") + `)`;
		const queryParams = Object.values(data);
		const [result] = await pool.query(query, queryParams);
		if (result.affectedRows === 0) {
			throw new Error("Error al crear la reseña");
		}
		return result;
	}
}