import { pool } from "../db.js";

export default class Resena {
  // Busca una reseña por su ID de reseña
  static async findById({ id, aprobada = true }) {
    /* 
      OBTIENE:
      - Toda la reseña con su información básica.
      - La información del usuario que hizo la reseña.
      - La información del museo al que pertenece la reseña.
      - La información de las fotos asociadas a la reseña.
      - La información de las visitas asociadas a la reseña.
      - La información de los servicios asociados a la reseña.
      - La información de las respuestas asociadas a la reseña.
    */
    let query = `
            SELECT 
              r.*, 
              u.*, 
              m.*, 
              GROUP_CONCAT(DISTINCT fr.f_res_foto) AS fotos, 
              GROUP_CONCAT(DISTINCT s.ser_id) AS servicios,
              GROUP_CONCAT(DISTINCT preg.pregunta) AS preguntas,
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
            LEFT JOIN preguntas preg ON preg.encuesta_enc_cve = m.mus_id
            LEFT JOIN respuestas resp ON resp.preguntas_preg_id = preg.preg_id 
                                    AND resp.preguntas_encuesta_enc_cve = preg.encuesta_enc_cve
            WHERE r.res_id_res = ?
          `;

    if (aprobada) {
      query += " AND r.res_aprobado = 1";
    }

    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  // Busca reseñas pendientes de un museo específico o de todos los museos
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
        u.*, 
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
}
