import { pool } from "../db.js";

export default class Resena {
  static async findById({ id, aprobada = true }) {
    let query = `
          SELECT 
            r.*, 
            u.usr_nombre, u.usr_ap_paterno, u.usr_ap_materno, u.usr_foto, 
            m.mus_id,
            GROUP_CONCAT(DISTINCT fr.f_res_foto) AS fotos, 
            GROUP_CONCAT(DISTINCT s.ser_id) AS servicios,
            GROUP_CONCAT(DISTINCT resp.res_respuesta) AS respuestas
          FROM resenia r
          JOIN visitas v ON r.visitas_vi_fechahora = v.vi_fechahora 
                        AND r.visitas_vi_usr_correo = v.vi_usr_correo 
                        AND r.visitas_vi_mus_id = v.vi_mus_id
          JOIN usuarios u ON v.vi_usr_correo = u.usr_correo
          JOIN museos m ON v.vi_mus_id = m.mus_id
          LEFT JOIN foto_resenia fr ON r.res_id_res = fr.f_res_id_res
          LEFT JOIN respuestas_servicios rs ON rs.visitas_vi_fechahora = v.vi_fechahora
                                          AND rs.visitas_vi_usr_correo = v.vi_usr_correo
                                          AND rs.visitas_vi_mus_id = v.vi_mus_id
          LEFT JOIN servicios s ON rs.servicios_ser_id = s.ser_id
          LEFT JOIN calificaciones c ON c.visitas_vi_fechahora = v.vi_fechahora
                                    AND c.visitas_vi_usr_correo = v.vi_usr_correo
                                    AND c.visitas_vi_mus_id = v.vi_mus_id
          LEFT JOIN respuestas resp ON resp.res_id = c.respuestas_res_id
                                  AND resp.preguntas_preg_id = c.respuestas_preguntas_preg_id
                                  AND resp.preguntas_encuesta_enc_cve = c.respuestas_preguntas_encuesta_enc_cve
          WHERE r.res_id_res = ?
          `;

    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findPendientes({ museoId = null }) {
    let query = `
      SELECT * FROM resenia
      WHERE res_aprobado = 0
    `;
    const queryParams = [];

    if (museoId !== null) {
      query += " AND visitas_vi_mus_id = ?";
      queryParams.push(museoId);
    }

    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findFoto({ id }) {
    const query = `
        SELECT * FROM foto_resenia
        WHERE f_res_id_res = ?
        `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findByMuseo({
    museoId,
    pagina = 1,
    porPagina = 10,
    filtros = {},
  }) {
    const connection = await pool.getConnection();
    try {
      const offset = (pagina - 1) * porPagina;
      const condicionesExtra = [];
      const valores = [museoId];

      if (filtros.rating) {
        condicionesExtra.push("r.res_calif_estrellas = ?");
        valores.push(parseInt(filtros.rating, 10));
      }

      if (filtros.tieneFotos) {
        condicionesExtra.push("fr.f_res_foto IS NOT NULL");
      }

      let whereClause = "v.vi_mus_id = ?";
      if (condicionesExtra.length > 0) {
        whereClause += " AND " + condicionesExtra.join(" AND ");
      }

      whereClause += " AND r.res_aprobado = 1"; // Solo reseñas aprobadas

      let orden;
      if (filtros.ordenFecha == "ASC") {
        orden = "r.visitas_vi_fechahora ASC";
      } else if (filtros.ordenFecha == "DESC") {
        orden = "r.visitas_vi_fechahora DESC";
      } else {
        orden = "r.visitas_vi_fechahora DESC"; // default
      }

      // 1. Consulta para total (sin LIMIT)
      let countQuery = `
      SELECT COUNT(DISTINCT r.res_id_res) AS total
      FROM resenia r
      JOIN visitas v ON r.visitas_vi_fechahora = v.vi_fechahora
                    AND r.visitas_vi_usr_correo = v.vi_usr_correo
                    AND r.visitas_vi_mus_id = v.vi_mus_id
      LEFT JOIN foto_resenia fr ON r.res_id_res = fr.f_res_id_res
      WHERE ${whereClause}
    `;

      // Reusar valores sin porPagina ni offset
      const [countResult] = await connection.query(countQuery, valores);
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / porPagina);

      // 2. Consulta para obtener página
      let query = `
      SELECT 
        r.*, 
        u.usr_nombre, u.usr_ap_paterno, u.usr_ap_materno, u.usr_foto, 
        m.mus_id,
        GROUP_CONCAT(DISTINCT fr.f_res_foto) AS fotos, 
        GROUP_CONCAT(DISTINCT s.ser_id) AS servicios,
        GROUP_CONCAT(DISTINCT resp.res_respuesta) AS respuestas
      FROM resenia r
      JOIN visitas v ON r.visitas_vi_fechahora = v.vi_fechahora 
                    AND r.visitas_vi_usr_correo = v.vi_usr_correo 
                    AND r.visitas_vi_mus_id = v.vi_mus_id
      JOIN usuarios u ON v.vi_usr_correo = u.usr_correo
      JOIN museos m ON v.vi_mus_id = m.mus_id
      LEFT JOIN foto_resenia fr ON r.res_id_res = fr.f_res_id_res
      LEFT JOIN respuestas_servicios rs ON rs.visitas_vi_fechahora = v.vi_fechahora
                                      AND rs.visitas_vi_usr_correo = v.vi_usr_correo
                                      AND rs.visitas_vi_mus_id = v.vi_mus_id
      LEFT JOIN servicios s ON rs.servicios_ser_id = s.ser_id
      LEFT JOIN calificaciones c ON c.visitas_vi_fechahora = v.vi_fechahora
                                AND c.visitas_vi_usr_correo = v.vi_usr_correo
                                AND c.visitas_vi_mus_id = v.vi_mus_id
      LEFT JOIN respuestas resp ON resp.res_id = c.respuestas_res_id
                              AND resp.preguntas_preg_id = c.respuestas_preguntas_preg_id
                              AND resp.preguntas_encuesta_enc_cve = c.respuestas_preguntas_encuesta_enc_cve
      WHERE ${whereClause}
      GROUP BY r.res_id_res
      ORDER BY ${orden}
      LIMIT ? OFFSET ?
    `;

      valores.push(porPagina, offset);
      const [rows] = await connection.query(query, valores);

      const resenas = rows.map((row) => ({
        ...row,
        servicios: row.servicios ? row.servicios.split(",").map(Number) : [],
        fotos: row.fotos ? row.fotos.split(",") : [],
        respuestas: row.respuestas ? row.respuestas.split(",") : [],
      }));

      return {
        resenas,
        total,
        totalPages,
        currentPage: pagina,
      };
    } catch (error) {
      console.error("Error fetching reseñas by museo:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByCorreo({ correo }) {
    const connection = await pool.getConnection();
    try {
      const query = `
            SELECT 
              r.*, 
              u.usr_nombre, u.usr_ap_paterno, u.usr_ap_materno, u.usr_foto, 
              m.mus_id,m.mus_nombre,
              GROUP_CONCAT(DISTINCT fr.f_res_foto) AS fotos, 
              GROUP_CONCAT(DISTINCT s.ser_id) AS servicios,
              GROUP_CONCAT(DISTINCT resp.res_respuesta) AS respuestas
            FROM resenia r
            JOIN visitas v ON r.visitas_vi_fechahora = v.vi_fechahora 
                          AND r.visitas_vi_usr_correo = v.vi_usr_correo 
                          AND r.visitas_vi_mus_id = v.vi_mus_id
            JOIN usuarios u ON v.vi_usr_correo = u.usr_correo
            JOIN museos m ON v.vi_mus_id = m.mus_id
            LEFT JOIN foto_resenia fr ON r.res_id_res = fr.f_res_id_res
            LEFT JOIN respuestas_servicios rs ON rs.visitas_vi_fechahora = v.vi_fechahora
                                            AND rs.visitas_vi_usr_correo = v.vi_usr_correo
                                            AND rs.visitas_vi_mus_id = v.vi_mus_id
            LEFT JOIN servicios s ON rs.servicios_ser_id = s.ser_id
            LEFT JOIN calificaciones c ON c.visitas_vi_fechahora = v.vi_fechahora
                                      AND c.visitas_vi_usr_correo = v.vi_usr_correo
                                      AND c.visitas_vi_mus_id = v.vi_mus_id
            LEFT JOIN respuestas resp ON resp.res_id = c.respuestas_res_id
                                    AND resp.preguntas_preg_id = c.respuestas_preguntas_preg_id
                                    AND resp.preguntas_encuesta_enc_cve = c.respuestas_preguntas_encuesta_enc_cve
            WHERE v.vi_usr_correo = ?
            GROUP BY r.res_id_res
          `;
      const [rows] = await connection.query(query, [correo]);
      return rows;
    } catch (error) {
      console.error("Error fetching reseñas by correo:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findAllMods() {
    const connection = await pool.getConnection();
    try {
      const query = `
            SELECT 
              r.*,
              m.mus_nombre
            FROM resenia r
            JOIN museos m ON r.visitas_vi_mus_id = m.mus_id
           `;
      const [rows] = await connection.query(query);
      return {
        resenas: rows,
      };
    } catch (error) {
      console.error("Error fetching all reseñas:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findAllModsByMuseo(museoId) {
    const connection = await pool.getConnection();
    try {
      const query = `
            SELECT 
              r.*,
              m.mus_nombre
            FROM resenia r
            JOIN museos m ON r.visitas_vi_mus_id = m.mus_id
            WHERE r.visitas_vi_mus_id = ?
           `;
      const [rows] = await connection.query(query, [museoId]);
      return {
        resenas: rows,
      };
    } catch (error) {
      console.error("Error fetching reseñas by museo:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async aprobarResena({ resenaId, modCorreo }) {
    const connection = await pool.getConnection();
    try {
      const query = `
              UPDATE resenia
              SET res_aprobado = 1, res_mod_correo = ?
              WHERE res_id_res = ?
            `;
      const [result] = await connection.query(query, [modCorreo, resenaId]);
      if (result.affectedRows === 0) {
        throw new Error("No se encontró la reseña para aprobar");
      }
      return {
        success: true,
        message: "Reseña aprobada correctamente",
      };
    } catch (error) {
      console.error("Error approving resena:", error);
      throw error;
    }
  }

  static async aprobar({ res_id_res, res_mod_correo, res_aprobado }) {
    const query = `
		UPDATE resenia
		SET res_aprobado = ?, 
			res_mod_correo = ?
		WHERE res_id_res = ?
		`;
    const queryParams = [];
    queryParams.push(res_aprobado, res_mod_correo, res_id_res);
    const [result] = await pool.query(query, queryParams);

    if (result.affectedRows === 0) {
      throw new Error("No se encontró la reseña para aprobar");
    }

    return { success: true, id: res_id_res };
  }

  static async edit({ res_id_res, resenaData, museoId, correo }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const data = { ...resenaData };
      const fecha = data.visitas_vi_fechahora;
      delete data.visitas_vi_fechahora; // Eliminar del objeto para evitar conflictos
      const fotos = data.fotos;
      delete data.fotos; // Eliminar del objeto para evitar conflictos

      if (Object.keys(data).length > 0) {
        const campos = Object.keys(data);
        const setClauses = campos.map((campo) => `${campo} = ?`).join(", ");
        const query = `UPDATE resenia SET ${setClauses} WHERE res_id_res = ?`;
        await connection.query(query, [...Object.values(data), res_id_res]);
      }

      // Actualizar la fecha de visita
      if (fecha) {
        const fechaQuery = `
          UPDATE visitas
          SET vi_fechahora = ?
          WHERE vi_usr_correo = ? AND vi_mus_id = ? 
          AND vi_fechahora = (SELECT visitas_vi_fechahora FROM resenia WHERE res_id_res = ?)
        `;
        await connection.query(fechaQuery, [
          fecha,
          correo,
          museoId,
          res_id_res,
        ]);
      }

      // Actualizar las fotos
      if (fotos && fotos.length > 0) {
        const deleteQuery = `
          DELETE FROM foto_resenia
          WHERE f_res_id_res = ?
        `;
        await connection.query(deleteQuery, [res_id_res]);

        const insertQuery = `
          INSERT INTO foto_resenia (f_res_id_res, f_res_foto)
          VALUES (?, ?)
        `;
        for (const foto of fotos) {
          await connection.query(insertQuery, [res_id_res, foto]);
        }
      }

      await connection.commit();
      return { success: true, id: res_id_res };
    } catch (error) {
      console.error("Error al editar la reseña:", error);
      await connection.rollback();
      throw error; // Preservamos el mensaje real del error
    } finally {
      connection.release();
    }
  }

  static async deleteById({ id }) {
    const query = `
      DELETE FROM resenia
      WHERE res_id_res = ?
    `;
    const queryParams = [];
    queryParams.push(id);
    const [result] = await pool.query(query, queryParams);

    if (result.affectedRows === 0) {
      throw new Error("No se encontró la reseña para eliminar");
    }

    return { success: true, id };
  }
}
