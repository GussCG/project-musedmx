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
    try {
      if (typeof data.respuestas === "string") {
        data.respuestas = JSON.parse(data.respuestas);
      }
      if (typeof data.servicios === "string") {
        try {
          data.servicios = JSON.parse(data.servicios);
        } catch (err) {
          console.error("Error al parsear servicios:", err);
          data.servicios = [];
        }
      }

      if (!Array.isArray(data.servicios)) {
        data.servicios = [];
      }

      for (const respuesta of data.respuestas) {
        // Buscar si ya existe una respuesta para esa pregunta, usuario y museo
        const [existing] = await connection.query(
          `SELECT res_id FROM respuestas_encuesta
         WHERE preguntas_preg_id = ?
           AND preguntas_encuesta_enc_cve = ?
           AND visitas_vi_usr_correo = ?
           AND visitas_vi_mus_id = ?`,
          [respuesta.preguntaId, encuestaId, correo, museoId]
        );

        if (existing.length > 0) {
          // Actualizar la respuesta
          await connection.query(
            `UPDATE respuestas_encuesta
            SET res_respuesta = ?
            WHERE res_id = ?`,
            [String(respuesta.respuesta), existing[0].res_id]
          );
        } else {
          // Insertar nueva respuesta
          await connection.query(
            `INSERT INTO respuestas_encuesta (
              res_respuesta,
              preguntas_preg_id,
              preguntas_encuesta_enc_cve,
              visitas_vi_usr_correo,
              visitas_vi_mus_id
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              String(respuesta.respuesta), // <-- conversión aquí también
              respuesta.preguntaId,
              encuestaId,
              correo,
              museoId,
            ]
          );
        }
      }

      // Eliminar todos los servicios anteriores
      await connection.query(
        `DELETE FROM respuestas_servicios
        WHERE visitas_vi_usr_correo = ?
        AND visitas_vi_mus_id = ?`,
        [correo, museoId]
      );

      // Insertar los servicios seleccionados del formulario
      for (const servicio of data.servicios) {
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
      console.error("Error al actualizar encuesta:", error);
      throw new Error("Error al actualizar encuesta");
    } finally {
      connection.release();
    }
  }
}
