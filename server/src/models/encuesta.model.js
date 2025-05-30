import { pool } from "../db.js";

export default class Encuesta {
  static async findPreguntas({ encuestaId }) {
    const query = `
            SELECT * FROM preguntas
            WHERE encuesta_enc_cve = ?
        `;
    const queryParams = [];
    queryParams.push(encuestaId);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findServicios() {
    const query = `
            SELECT * FROM servicios
        `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findEncuesta({ encuestaId, museoId, correo }) {
    const [preguntas] = await pool.query(
      `
            SELECT 
                p.preg_id,
                p.pregunta,
                r.res_id,
                r.res_respuesta
            FROM preguntas p
            LEFT JOIN respuestas r ON r.preguntas_preg_id = p.preg_id
            WHERE p.encuesta_enc_cve = ?
        `,
      [encuestaId]
    );

    const [respuestasSeleccionadas] = await pool.query(
      `
            SELECT
                c.respuestas_preguntas_preg_id AS preg_id,
                c.respuestas_res_id AS res_id,
                r.res_respuesta
            FROM calificaciones c
            JOIN respuestas r ON c.respuestas_res_id = r.res_id
            WHERE 
                c.visitas_vi_usr_correo = ?
                AND c.visitas_vi_mus_id = ?
                AND c.respuestas_preguntas_encuesta_enc_cve = ?
            `,
      [correo, museoId, encuestaId]
    );

    const [serviciosSeleccionados] = await pool.query(
      `
            SELECT 
                s.ser_id,
                s.ser_nombre
            FROM respuestas_servicios rs
            JOIN servicios s ON rs.servicios_ser_id = s.ser_id
            WHERE 
                rs.visitas_vi_usr_correo = ?
                AND rs.visitas_vi_mus_id = ?
        `,
      [correo, museoId]
    );

    const preguntasMap = {};

    for (const row of preguntas) {
      if (!preguntasMap[row.preg_id]) {
        preguntasMap[row.preg_id] = {
          preg_id: row.preg_id,
          pregunta: row.pregunta,
          respuestas: [],
          respuestaSeleccionada: null,
        };
      }
      if (row.res_id) {
        preguntasMap[row.preg_id].respuestas.push({
          res_id: row.res_id,
          res_respuesta: row.res_respuesta,
        });
      }
    }

    for (const row of respuestasSeleccionadas) {
      if (preguntasMap[row.preg_id]) {
        preguntasMap[row.preg_id].respuestaSeleccionada = row.res_id;
      }
    }

    const contestada =
      respuestasSeleccionadas.length > 0 && serviciosSeleccionados.length > 0;

    return {
      contestada,
      servicios: serviciosSeleccionados.map((servicio) => ({
        ser_id: servicio.ser_id,
        ser_nombre: servicio.ser_nombre,
      })),
      respuestas: respuestasSeleccionadas.map((respuesta) => ({
        preg_id: respuesta.preg_id,
        res_id: respuesta.res_id,
        res_respuesta: respuesta.res_respuesta,
      })),
    };
  }

  static async findRespuestasTotales({ encuestaId, museoId }) {
    const [respuestas] = await pool.query(
      `
        SELECT
          p.preg_id,
          AVG(CAST(r.res_respuesta AS UNSIGNED)) AS promedio_respuesta
        FROM respuestas r
        JOIN preguntas p
          ON r.preguntas_preg_id = p.preg_id
          AND r.preguntas_encuesta_enc_cve = p.encuesta_enc_cve
        JOIN calificaciones c
          ON r.res_id = c.respuestas_res_id
          AND r.preguntas_preg_id = c.respuestas_preguntas_preg_id
          AND r.preguntas_encuesta_enc_cve = c.respuestas_preguntas_encuesta_enc_cve
        WHERE p.encuesta_enc_cve = ?
          AND c.visitas_vi_mus_id = ?
        GROUP BY p.preg_id
        ORDER BY p.preg_id
      `,
      [encuestaId, museoId]
    );

    const [servicios] = await pool.query(
      `
        SELECT
          s.ser_id,
          s.ser_nombre,
          COUNT(*) AS veces_seleccionado
        FROM respuestas_servicios rs
        JOIN servicios s
          ON rs.servicios_ser_id = s.ser_id
        WHERE rs.visitas_vi_mus_id = ?
        GROUP BY s.ser_id, s.ser_nombre
        ORDER BY veces_seleccionado DESC
      `,
      [museoId]
    );

    return {
      respuestas,
      servicios,
    };
  }

  static async registrarEncuesta({
    encuestaId,
    museoId,
    correo,
    resenaData,
    fechahora,
  }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      // Registrar respuestas
      for (const respuesta of resenaData.respuestas) {
        const query = `
          INSERT INTO calificaciones (
            visitas_vi_usr_correo,
            visitas_vi_mus_id,
            visitas_vi_fechahora,
            respuestas_preguntas_preg_id,
            respuestas_res_id,
            respuestas_preguntas_encuesta_enc_cve
          ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const queryParams = [
          correo,
          museoId,
          fechahora,
          respuesta.preg_id,
          respuesta.res_id,
          encuestaId,
        ];
        await connection.query(query, queryParams);
      }

      // Registrar servicios
      for (const servicio of resenaData.servicios) {
        const query = `
          INSERT INTO respuestas_servicios (
            visitas_vi_fechahora,
            visitas_vi_usr_correo,
            visitas_vi_mus_id,
            servicios_ser_id
          ) VALUES (?, ?, ?, ?)
        `;
        const queryParams = [fechahora, correo, museoId, servicio.ser_id];
        await connection.query(query, queryParams);
      }

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error al registrar encuesta:", error);
      throw new Error("Error al registrar encuesta");
    } finally {
      connection.release();
    }
  }

  static async updateEncuesta({ encuestaId, museoId, correo, data }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    console.log("Actualizando encuesta:", {
      encuestaId,
      museoId,
      correo,
      data,
    });
    try {
      // Eliminar respuestas existentes
      const deleteQuery1 = `
          DELETE FROM calificaciones
          WHERE visitas_vi_usr_correo = ?
            AND visitas_vi_mus_id = ?
            AND respuestas_preguntas_encuesta_enc_cve = ?
        `;

      const deleteParams1 = [correo, museoId, encuestaId];

      await connection.query(deleteQuery1, deleteParams1);
      // Registrar nuevas respuestas
      for (const respuesta of data.respuestas) {
        const insertQuery = `
              INSERT INTO calificaciones (
                visitas_vi_usr_correo,
                visitas_vi_mus_id,
                respuestas_preguntas_preg_id,
                respuestas_res_id,
                respuestas_preguntas_encuesta_enc_cve
              ) VALUES (?, ?, ?, ?, ?)
            `;
        const insertParams = [
          correo,
          museoId,
          respuesta.preguntaId,
          respuesta.respuesta,
          encuestaId,
        ];
        await connection.query(insertQuery, insertParams);
      }

      // Eliminar respuestas de servicios existentes
      const deleteQuery2 = `
          DELETE FROM respuestas_servicios
          WHERE visitas_vi_usr_correo = ?
            AND visitas_vi_mus_id = ?
        `;
      const deleteParams2 = [correo, museoId];
      await connection.query(deleteQuery2, deleteParams2);

      // Registrar nuevos servicios
      for (const servicio of data.servicios) {
        const insertQuery = `
              INSERT INTO respuestas_servicios (
                visitas_vi_usr_correo,
                visitas_vi_mus_id,
                servicios_ser_id
              ) VALUES (?, ?, ?)
            `;
        const insertParams = [correo, museoId, servicio]; // <-- aquí
        await connection.query(insertQuery, insertParams);
      }
      // Confirmar transacción
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error al actualizar encuesta:", error);
      throw new Error("Error al actualizar encuesta");
    } finally {
      connection.release();
    }
  }
}
