import { pool } from "../db.js";

export default class Usuario {
  static async findById(usr_correo) {
    //Obtener los datos del usuario por su correo y las tematicas que tiene asignadas
    const query = `
		SELECT u.*,    
			JSON_ARRAYAGG(uht.tematicas_tm_nombre) AS usr_tematicas
		FROM 
			musedmx.usuarios u
		JOIN 
			musedmx.usuarios_has_tematicas uht ON u.usr_correo = uht.usuarios_usr_correo
		WHERE 
			u.usr_correo = ?
		GROUP BY u.usr_correo;
		`;

    const [rows] = await pool.query(query, [usr_correo]);
    return rows[0];
  }

  static async create(userData) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const {
        usr_correo,
        usr_nombre,
        usr_ap_paterno,
        usr_ap_materno,
        usr_contrasenia,
        usr_fecha_nac,
        usr_telefono,
        usr_foto,
        usr_tipo,
        usr_tematicas = [],
      } = userData;

      const [result] = await connection.query(
        `
			INSERT INTO usuarios (
				usr_correo, 
				usr_nombre, 
				usr_ap_paterno, 
				usr_ap_materno, 
				usr_contrasenia, 
				usr_fecha_nac, 
				usr_telefono, 
				usr_foto,
				usr_tipo
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
        [
          usr_correo,
          usr_nombre,
          usr_ap_paterno,
          usr_ap_materno,
          usr_contrasenia,
          usr_fecha_nac,
          usr_telefono,
          usr_foto,
          usr_tipo,
        ]
      );

      for (const tematica of usr_tematicas) {
        await connection.query(
          `
			INSERT INTO usuarios_has_tematicas (usuarios_usr_correo, tematicas_tm_nombre)
			VALUES (?, ?)
		  `,
          [usr_correo, tematica]
        );
      }
      await connection.commit();
      return {
        success: true,
      };
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw new Error("Error al crear el usuario");
    } finally {
      connection.release();
    }
  }

  static async updateUser(usr_correo, fields) {
    // Separar la lógica de actualización de usuario y temáticas
    // Actualizar el usuario quitando las temáticas
    const allowedFields = [
      "usr_nombre",
      "usr_ap_paterno",
      "usr_ap_materno",
      "usr_contrasenia",
      "usr_fecha_nac",
      "usr_telefono",
      "usr_foto",
    ];
    const filteredFields = Object.keys(fields).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = fields[key];
      }
      return acc;
    }, {});

    const query =
      `UPDATE usuarios SET ` +
      Object.keys(filteredFields)
        .map((key) => `${key} = ?`)
        .join(", ") +
      " WHERE usr_correo = ?";
    const queryParams = [...Object.values(filteredFields), usr_correo];
    const [result] = await pool.query(query, queryParams);
    if (result.affectedRows === 0) {
      throw new Error("Usuario no encontrado");
    }

    if (fields.tematicas) {
      let query2 = `DELETE FROM usuarios_has_tematicas WHERE usuarios_usr_correo = ?`;
      await pool.query(query2, [usr_correo]);

      query2 = `INSERT INTO usuarios_has_tematicas VALUES `;
      query2 +=
        `('${usr_correo}', ?), `.repeat(fields.tematicas.length - 1) +
        `('${usr_correo}', ?);`;
      await pool.query(query2, [...fields.tematicas, ...fields.tematicas]);
    }

    return result;
  }

  static async deleteUser(usr_correo) {
    const query = `DELETE FROM usuarios WHERE usr_correo = ?`;
    const [result] = await pool.query(query, [usr_correo]);
    if (result.affectedRows === 0) {
      throw new Error("Usuario no encontrado");
    }
    return result;
  }
}
