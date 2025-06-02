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
      LEFT JOIN respuestas_encuesta r 
        ON r.preguntas_preg_id = p.preg_id
        AND r.preguntas_encuesta_enc_cve = p.encuesta_enc_cve
        AND r.visitas_vi_usr_correo IS NULL -- solo plantillas
      WHERE p.encuesta_enc_cve = ?
    `,
      [encuestaId]
    );

    const [respuestasSeleccionadas] = await pool.query(
      `
      SELECT
        r.preguntas_preg_id AS preg_id,
        r.res_id,
        r.res_respuesta
      FROM respuestas_encuesta r
      WHERE 
        r.visitas_vi_usr_correo = ?
        AND r.visitas_vi_mus_id = ?
        AND r.preguntas_encuesta_enc_cve = ?
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

    const totalPreguntas = Object.keys(preguntasMap).length;
    const totalRespondidas = respuestasSeleccionadas.length;

    const contestada = totalRespondidas === totalPreguntas;

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
      FROM respuestas_encuesta r
      JOIN preguntas p ON r.preguntas_preg_id = p.preg_id
      WHERE 
        p.encuesta_enc_cve = ?
        AND r.visitas_vi_mus_id = ?
        AND r.visitas_vi_usr_correo IS NOT NULL
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
      JOIN servicios s ON rs.servicios_ser_id = s.ser_id
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

  static async registrarEncuesta({ encuestaId, museoId, correo, resenaData }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const respuestas = Array.isArray(resenaData.respuestas)
        ? resenaData.respuestas
        : [];
      const servicios = Array.isArray(resenaData.servicios)
        ? resenaData.servicios
        : [];

      for (const respuesta of respuestas) {
        await connection.query(
          `INSERT INTO respuestas_encuesta (
                    res_respuesta,
                    preguntas_preg_id,
                    preguntas_encuesta_enc_cve,
                    visitas_vi_usr_correo,
                    visitas_vi_mus_id
                ) VALUES (?, ?, ?, ?, ?)`,
          [
            String(respuesta.respuesta),
            respuesta.preguntaId,
            encuestaId,
            correo,
            museoId,
          ]
        );
      }
      for (const servicio of servicios) {
        await connection.query(
          `INSERT INTO respuestas_servicios (
                    visitas_vi_usr_correo,
                    visitas_vi_mus_id,
                    servicios_ser_id
                ) VALUES (?, ?, ?)`,
          [correo, museoId, servicio]
        );
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
    try {
      // Validación robusta de datos
      const respuestas = Array.isArray(data.respuestas)
        ? data.respuestas.filter(
            (r) =>
              Number.isInteger(r.preguntaId) && Number.isInteger(r.respuesta)
          )
        : [];

      const servicios = Array.isArray(data.servicios)
        ? data.servicios.filter(Number.isInteger)
        : [];

      // Eliminar respuestas anteriores de manera eficiente
      const [deleteRespuestas] = await connection.query(
        `DELETE FROM respuestas_encuesta 
             WHERE preguntas_encuesta_enc_cve = ?
               AND visitas_vi_usr_correo = ?
               AND visitas_vi_mus_id = ?`,
        [encuestaId, correo, museoId]
      );

      // Insertar nuevas respuestas en batch si existen
      if (respuestas.length > 0) {
        const values = respuestas.map((r) => [
          String(r.respuesta),
          r.preguntaId,
          encuestaId,
          correo,
          museoId,
        ]);

        await connection.query(
          `INSERT INTO respuestas_encuesta (
                    res_respuesta,
                    preguntas_preg_id,
                    preguntas_encuesta_enc_cve,
                    visitas_vi_usr_correo,
                    visitas_vi_mus_id
                ) VALUES ?`,
          [values]
        );
      }

      // Eliminar servicios anteriores
      const [deleteServicios] = await connection.query(
        `DELETE FROM respuestas_servicios
             WHERE visitas_vi_usr_correo = ?
               AND visitas_vi_mus_id = ?`,
        [correo, museoId]
      );

      // Insertar nuevos servicios en batch si existen
      if (servicios.length > 0) {
        const values = servicios.map((s) => [correo, museoId, s]);

        await connection.query(
          `INSERT INTO respuestas_servicios (
                    visitas_vi_usr_correo,
                    visitas_vi_mus_id,
                    servicios_ser_id
                ) VALUES ?`,
          [values]
        );
      }

      await connection.commit();
      return {
        success: true,
        affectedRows: {
          respuestas: deleteRespuestas.affectedRows,
          servicios: deleteServicios.affectedRows,
        },
      };
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error en updateEncuesta:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
