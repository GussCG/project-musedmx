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
          SELECT 
            m.*,
            AVG(r.res_calif_estrellas) AS mus_calificacion,
            COUNT(r.res_id_res) AS total_resenias
          FROM museos m
          LEFT JOIN resenia r ON r.visitas_vi_mus_id = m.mus_id AND r.res_aprobado = 1
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

    query += ` GROUP BY m.mus_id `;

    if (sort) {
      switch (sort) {
        case "name":
          query += ` ORDER BY mus_nombre DESC`;
          break;
        case "best-rating": // Pero la calificacion es
          query += ` ORDER BY AVG(r.res_calif_estrellas) DESC, total_resenias DESC`;
          break;
        case "worst-rating":
          query += ` ORDER BY AVG(r.res_calif_estrellas) ASC, total_resenias DESC`;
          break;
        default:
          query += ` ORDER BY mus_nombre ASC`;
          break;
      }
    } else {
      query += ` ORDER BY mus_nombre ASC`;
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

  static async findAllNamesAndDescriptions() {
    const query = `
      SELECT 
        mus_id, mus_nombre, mus_descripcion 
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

  static async findGaleriaById({ id, limit }) {
    let query = `
      SELECT * FROM galeria
      WHERE gal_mus_id = ?
      ORDER BY RAND()
      `;
    const queryParams = [];
    queryParams.push(id);

    if (limit) {
      query += ` LIMIT ?`;
      queryParams.push(parseInt(limit));
    }

    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findFotoGaleriaById({ id }) {
    const query = `
          SELECT * FROM galeria
          WHERE gal_foto_id = ?
    `;
    const queryParams = [];
    queryParams.push(id);
    const [rows] = await pool.query(query, queryParams);
    return {
      success: true,
      galeria: rows.length > 0 ? rows[0] : null,
    };
  }

  static async addFotosGaleria({ id, galeria }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
        INSERT INTO galeria (gal_mus_id, gal_foto)
        VALUES (?, ?)
      `;

      for (const foto of galeria) {
        const queryParams = [id, foto];
        await connection.query(query, queryParams);
      }

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error adding fotos galeria:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteFotoGaleriaById({ id, galFotoId }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
        DELETE FROM galeria
        WHERE gal_foto_id = ? AND gal_mus_id = ?
      `;
      const queryParams = [galFotoId, id];
      await connection.query(query, queryParams);

      if (connection.affectedRows === 0) {
        throw new Error("No se encontró la foto de galería para eliminar.");
      }

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error deleting foto galeria:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteGaleriaById(id) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
        DELETE FROM galeria
        WHERE gal_mus_id = ?
      `;
      const queryParams = [id];
      await connection.query(query, queryParams);
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error deleting galeria:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async guardarGaleria(id, urls) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const url of urls) {
        const query = `
          INSERT INTO galeria (gal_mus_id, gal_foto)
          VALUES (?, ?)
        `;
        const queryParams = [id, url];
        await connection.query(query, queryParams);
      }
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error saving galeria:", error);
      throw error;
    } finally {
      connection.release();
    }
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
      const endpoint = `${API_URL}/api/v1/recomendaciones/populares`;
      const response = await axios.get(endpoint, {
        params: {
          top_n: top_n,
        },
      });

      const museos = response.data;
      if (!museos || museos.length === 0) {
        return { museos: [] };
      }

      const museosIds = museos.map((id) => Number(id));

      const placeholders = museosIds.map(() => "?").join(",");
      const query = `SELECT * FROM museos WHERE mus_id IN (${placeholders})`;
      const [rows] = await pool.query(query, museosIds);

      const resultadosOrdenados = museosIds
        .map((id) => rows.find((row) => row.mus_id === id))
        .filter(Boolean); // Filtra nulls si algún ID no existe

      return { museos: resultadosOrdenados };
    } catch (error) {
      console.error("Error fetching populares:", error);
      throw error;
    }
  }

  static async findSugeridosByCorreo({ correo, top_n }) {
    try {
      const endpoint = `${API_URL}/api/v1/recomendaciones/personalizada/${correo}`;
      const response = await axios.get(endpoint, {
        params: {
          top_n: top_n,
        },
      });

      const museos = response.data;
      if (!museos || museos.length === 0) {
        return { museos: [] };
      }

      const museosIds = museos.map((museo) => museo.mus_id);
      const placeholders = museosIds.map(() => "?").join(",");
      const query = `SELECT * FROM museos WHERE mus_id IN (${placeholders})`;
      const [rows] = await pool.query(query, museosIds);

      return { museos: rows };
    } catch (error) {
      console.error("Error fetching sugeridos:", error);
      throw error;
    }
  }

  static async findSimilaresById({ id, top_n }) {
    try {
      const endpoint = `${API_URL}/api/v1/recomendaciones/similares/${id}`;
      const response = await axios.get(endpoint, {
        params: {
          top_n: top_n,
        },
      });

      const museos = response.data;
      if (!museos || museos.length === 0) {
        return { museos: [] };
      }

      const museosIds = museos.map((museo) => museo.mus_id);
      const museosMap = new Map(museos.map((m) => [m.mus_id, m]));

      const placeholders = museosIds.map(() => "?").join(",");
      const query = `SELECT * FROM museos WHERE mus_id IN (${placeholders})`;
      const [rows] = await pool.query(query, museosIds);

      // Corrección: Filtrar y mapear correctamente
      const resultadosOrdenados = museosIds
        .map((id) => rows.find((row) => row.mus_id === id))
        .filter((museo) => museo !== undefined); // Filtramos los undefined

      return {
        museos: resultadosOrdenados,
        metadatos: resultadosOrdenados.map((m) => ({
          mus_id: m.mus_id,
          similitud: museosMap.get(m.mus_id)?.similitud,
        })),
      };
    } catch (error) {
      console.error("Error fetching similares:", error);
      throw error;
    }
  }

  static async findCercaById({ id, top_n }) {
    try {
      const endpoint = `${API_URL}/api/v1/recomendaciones/cercanas/${id}`;
      const response = await axios.get(endpoint, {
        params: {
          top_n: top_n,
        },
      });

      const museos = response.data;
      if (!museos || museos.length === 0) {
        return { museos: [] };
      }

      const museosIds = museos.map((museo) => museo.mus_id);

      const museosMap = new Map(museos.map((m) => [m.mus_id, m]));

      const placeholders = museosIds.map(() => "?").join(",");
      const query = `SELECT * FROM museos WHERE mus_id IN (${placeholders})`;
      const [rows] = await pool.query(query, museosIds);

      const resultadosOrdenados = museosIds
        .map((id) => rows.find((row) => row.mus_id === id))
        .filter(Boolean);

      return {
        museos: resultadosOrdenados,
        // Opcional: incluir distancia
        metadatos: resultadosOrdenados.map((m) => ({
          mus_id: m.mus_id,
          distancia: museosMap.get(m.mus_id)?.distancia,
        })),
      };
    } catch (error) {
      console.error("Error fetching cerca:", error);
      throw error;
    }
  }

  static async findAsociacionById({ id, top_n }) {
    try {
      const endpoint = `${API_URL}/api/v1/recomendaciones/asociadas/${id}`;
      const response = await axios.get(endpoint, {
        params: {
          top_n: top_n,
        },
      });

      const museos = response.data;
      if (!museos || museos.length === 0) {
        return { museos: [] };
      }

      const museosIds = museos.map((museo) => museo.mus_id);
      const placeholders = museosIds.map(() => "?").join(",");
      const query = `SELECT * FROM museos WHERE mus_id IN (${placeholders})`;
      const [rows] = await pool.query(query, museosIds);

      return { museos: rows };
    } catch (error) {
      console.error("Error fetching asociacion:", error);
      throw error;
    }
  }

  static async updateHorarioByDia({ id, dia, horarioData }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
        UPDATE horarios_precios_museo
        SET mh_hora_inicio = ?,
            mh_hora_fin = ?,
            mh_precio_ad = ?,
            mh_precio_ni = ?,
            mh_precio_ter = ?,
            mh_precio_est = ?
        WHERE mh_mus_id = ?
        AND mh_dia = ?
      `;

      const queryParams = [
        horarioData.mh_hora_inicio,
        horarioData.mh_hora_fin,
        horarioData.mh_precio_ad,
        horarioData.mh_precio_ni,
        horarioData.mh_precio_ter,
        horarioData.mh_precio_est,
        id,
        dia,
      ];

      await connection.query(query, queryParams);
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error updating horario:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async addByDia({ id, dia }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
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
      `;

      const queryParams = [id, dia, "00:00:00", "00:00:00", "0", "0", "0", "0"];

      await connection.query(query, queryParams);
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error adding dia:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteByDia({ id, dia }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const query = `
        DELETE FROM horarios_precios_museo
        WHERE mh_mus_id = ?
        AND mh_dia = ?
      `;

      const queryParams = [id, dia];

      await connection.query(query, queryParams);
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error("Error deleting dia:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
