import { pool } from "../db.js";
import axios from "axios";

// Obtener la url de la api desde el .env
const API_URL = process.env.RECOMMENDATION_API_URL;

export default class Museo {
  static async findAll({
    search,
    tipos,
    alcaldias,
    sort,
    limit,
    page,
    isMapView = false,
  }) {
    const itemsPerPage = limit ? parseInt(limit) : isMapView ? null : 12;
    const currentPage = page ? Math.max(1, parseInt(page)) : 1;

    let query = `
      SELECT m.*,
      (
        SELECT AVG(r.res_calif_estrellas)
        FROM resenia r
        WHERE r.visitas_vi_mus_id = m.mus_id
        AND r.res_aprobado = 1
      ) as mus_calificacion,
      (
        SELECT COUNT(r.res_id_res)
        FROM resenia r
        WHERE r.visitas_vi_mus_id = m.mus_id
        AND r.res_aprobado = 1
      ) as total_resenias
      FROM museos m
      WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
      query += ` AND (mus_nombre LIKE ? OR mus_descripcion LIKE ?) `;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (tipos && tipos.length > 0) {
      query += ` AND mus_tematica IN (${tipos.map(() => "?").join(",")}) `;
      queryParams.push(...tipos);
    }

    if (alcaldias && alcaldias.length > 0) {
      query += ` AND mus_alcaldia IN (${alcaldias.map(() => "?").join(",")}) `;
      queryParams.push(...alcaldias);
    }

    if (sort) {
      switch (sort) {
        case "name":
          query += ` ORDER BY mus_nombre DESC`;
          break;
        case "best-rating": // Pero la calificacion es
          query += ` ORDER BY mus_calificacion ASC`;
          break;
        case "worst-rating":
          query += ` ORDER BY mus_calificacion DESC`;
          break;
        default:
          query += ` ORDER BY mus_nombre ASC`;
          break;
      }
    }

    // Contar total
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as count_table`;
    const [countResult] = await pool.query(countQuery, queryParams);
    const totalItems = countResult[0].total;

    // Aplicar límite y paginación según corresponda
    if (limit) {
      query += ` LIMIT ?`;
      queryParams.push(parseInt(limit));

      if (!isMapView && page) {
        const offset = (currentPage - 1) * parseInt(limit);
        query += ` OFFSET ?`;
        queryParams.push(offset);
      }
    }

    const [rows] = await pool.query(query, queryParams);

    return {
      items: rows,
      totalItems: totalItems,
      totalPages: limit ? Math.ceil(totalItems / parseInt(limit)) : 1,
      currentPage: currentPage,
      itemsPerPage: limit ? parseInt(limit) : totalItems,
    };
  }

  static async findAllNames() {
    const query = `
      SELECT 
        mus_id, mus_nombre 
      FROM museos
      ORDER BY RAND()
      `;
    const [rows] = await pool.query(query, []);
    return rows;
  }

  static async findById({ id }) {
    const query = `
      SELECT * from museos 
      WHERE mus_id = ?
      LIMIT 1
      `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows[0];
  }

  static async create(museoData) {
  	let query = `INSERT INTO museos (` + Object.keys(museoData).join(", ") + `) VALUES (` + Object.keys(museoData).map(() => "?").join(", ") + `)`;
  	const queryParams = Object.values(museoData);
  	const [result] = await pool.query(query, queryParams);
  	if (result.affectedRows === 0) {
  		throw new Error("Error al crear el museo");
  	}
  	return result;
  }

  static async findGaleriaById({ id }) {
    const query = `
      SELECT * FROM galeria
      WHERE gal_mus_id = ?
      ORDER BY RAND()
      LIMIT 10
      `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findGaleriaById({ id }) {
    const query = `
      SELECT * FROM galeria
      WHERE gal_mus_id = ?
      ORDER BY RAND()
      LIMIT 10
      `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findHorariosById({ id }) {
    const query = `
      SELECT * FROM horarios_precios_museo
      WHERE mh_mus_id = ?
      ORDER BY mh_dia
      `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findRedesById({ id }) {
    const query = `
      SELECT * FROM museos_have_red_soc
      WHERE mhrs_mus_id = ?
      ORDER BY mhrs_cve_rs
      `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findResenasById({ id }) {
    const query = `
      SELECT * FROM resenia
      WHERE visitas_vi_mus_id = ?
      AND res_aprobado = 1
      ORDER BY visitas_vi_fechahora DESC
      `;
    const queryParams = [];
    queryParams.push(id);

    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async create(museoData) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const {
        mus_nombre,
        mus_calle,
        mus_num_ext,
        mus_colonia,
        mus_cp,
        mus_alcaldia,
        mus_descripcion,
        mus_fec_ap,
        mus_tematica,
        mus_foto,
        mus_g_latitud,
        mus_g_longitud,
        galeria = [],
        horarios_precios = [],
        redes_sociales = [],
        enc_cve = 1,
      } = museoData;

      console.log(typeof redes_sociales);

      const [result] = await connection.query(
        `
          INSERT INTO museos (
            mus_nombre,
            mus_calle,
            mus_num_ext,
            mus_colonia,
            mus_cp,
            mus_alcaldia,
            mus_descripcion,
            mus_fec_ap,
            mus_tematica,
            mus_foto,
            mus_g_latitud,
            mus_g_longitud
          )
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
          mus_nombre,
          mus_calle,
          mus_num_ext,
          mus_colonia,
          mus_cp,
          mus_alcaldia,
          mus_descripcion,
          mus_fec_ap,
          mus_tematica,
          mus_foto,
          mus_g_latitud,
          mus_g_longitud,
        ]
      );

      const mus_id = result.insertId;

      const dias = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ];
      for (const dia of dias) {
        await connection.execute(
          `
            INSERT INTO horarios_precios_museo (
              mh_mus_id,
              mh_dia,
              mh_hora_inicio,
              mh_hora_fin,
              mh_precio_ad,
              mh_precio_ni,
              mh_precio_ter,
              mh_precio_est
            )
            VALUES (?,?,?,?,?,?,?,?)
          `,
          [mus_id, dia, "00:00:00", "00:00:00", "0", "0", "0", "0"]
        );
      }

      if (enc_cve) {
        await connection.execute(
          `
            INSERT INTO museos_has_encuesta (
              museos_mus_id,
              encuesta_enc_cve
            )
            VALUES (?,?)
          `,
          [mus_id, enc_cve]
        );
      }

      let parsedRedes = redes_sociales;

      if (typeof redes_sociales === "string") {
        try {
          parsedRedes = JSON.parse(redes_sociales);
          console.log("Redes sociales parseadas:", parsedRedes);
        } catch (e) {
          console.error("Error al parsear redes_sociales:", e);
          parsedRedes = [];
        }
      }

      if (Array.isArray(parsedRedes) && parsedRedes.length > 0) {
        await Promise.all(
          parsedRedes.map((red) =>
            connection.execute(
              `
                INSERT INTO museos_have_red_soc (
                  mhrs_mus_id,
                  mhrs_cve_rs,
                  mhrs_link
                )
                VALUES (?,?,?)
              `,
              [mus_id, red.id, red.link]
            )
          )
        );
      }

      await connection.commit();
      return {
        success: true,
        mus_id,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating museo:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update({ id, museoData }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const { redes_sociales, ...datosMuseo } = museoData;

      if (Object.keys(datosMuseo).length > 0) {
        const campos = Object.keys(datosMuseo);
        const setClause = campos.map((campo) => `${campo} = ?`).join(", ");
        const query = `
          UPDATE museos
          SET ${setClause}
          WHERE mus_id = ?
        `;

        await connection.query(query, [...Object.values(datosMuseo), id]);
      }

      if (Array.isArray(redes_sociales)) {
        // Eliminar todas las redes sociales existentes
        await connection.query(
          `
            DELETE FROM museos_have_red_soc
            WHERE mhrs_mus_id = ?
          `,
          [id]
        );

        // Insertar las nuevas redes sociales
        await Promise.all(
          redes_sociales.map((red) =>
            connection.query(
              `
                INSERT INTO museos_have_red_soc (
                  mhrs_mus_id,
                  mhrs_cve_rs,
                  mhrs_link
                )
                VALUES (?,?,?)
              `,
              [id, red.id, red.link]
            )
          )
        );
      }

      await connection.commit();
      connection.release();
      return {
        success: true,
        message: "Museo actualizado correctamente",
        mus_id: id,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error updating museo:", error);
      throw error;
    }
  }

  static async findPopulares({ top_n }) {
    try {
      const endpoint = `${API_URL}/populares`;
      const response = await axios.get(endpoint, {
        params: {
          top_n: top_n,
        },
      });
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching populares:", error);
      throw error;
    }
  }
}
