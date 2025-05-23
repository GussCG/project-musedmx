import { pool } from "../db.js";

export default class Usuario {
  static async findOne({ usr_correo }) {
    const connection = await pool.getConnection();
    try {
      const query = `
      SELECT 
        u.usr_correo,
        u.usr_nombre,
        u.usr_ap_paterno,
        u.usr_ap_materno,
        u.usr_contrasenia,
        u.usr_fecha_nac,
        u.usr_telefono,
        u.usr_foto,
        u.usr_tipo,
        t.tm_nombre AS tematica
      FROM usuarios u
      LEFT JOIN usuarios_has_tematicas ut ON u.usr_correo = ut.usuarios_usr_correo
      LEFT JOIN tematicas t ON ut.tematicas_tm_nombre = t.tm_nombre
      WHERE u.usr_correo = ?
    `;
      const [rows] = await connection.query(query, [usr_correo]);
      if (rows.length === 0) return null;

      const userInfo = {
        usr_correo: rows[0].usr_correo,
        usr_nombre: rows[0].usr_nombre,
        usr_ap_paterno: rows[0].usr_ap_paterno,
        usr_ap_materno: rows[0].usr_ap_materno,
        usr_contrasenia: rows[0].usr_contrasenia,
        usr_fecha_nac: rows[0].usr_fecha_nac,
        usr_telefono: rows[0].usr_telefono,
        usr_foto: rows[0].usr_foto,
        usr_tipo: rows[0].usr_tipo,
        usr_tematicas: rows.map((row) => row.tematica).filter(Boolean), // Array de temáticas
      };

      return userInfo;
    } catch (error) {
      throw new Error("Error al buscar el usuario");
    } finally {
      connection.release();
    }
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

  static async updateUser(usr_correo, userData) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const data = { ...userData };
      delete data.usr_tematicas;

      console.log("Data a actualizar:", data);

      if (Object.keys(data).length > 0) {
        const campos = Object.keys(data);
        const setClauses = campos.map((campo) => `${campo} = ?`).join(", ");
        const query = `UPDATE usuarios SET ${setClauses} WHERE usr_correo = ?`;

        await connection.query(query, [...Object.values(data), usr_correo]);
      }

      if (userData.usr_tematicas) {
        await connection.query(
          `DELETE FROM usuarios_has_tematicas WHERE usuarios_usr_correo = ?`,
          [usr_correo]
        );

        for (const tematica of userData.usr_tematicas) {
          await connection.query(
            `
          INSERT INTO usuarios_has_tematicas (usuarios_usr_correo, tematicas_tm_nombre)
          VALUES (?, ?)
        `,
            [usr_correo, tematica]
          );
        }
      }

      // Obtener el usuario actualizado
      const [rows] = await connection.query(
        `SELECT * FROM usuarios WHERE usr_correo = ?`,
        [usr_correo]
      );

      await connection.commit();
      return {
        success: true,
        message: "Usuario actualizado",
        usuario: rows[0],
      };
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      await connection.rollback();
      throw error; // Preservamos el mensaje real del error
    } finally {
      connection.release();
    }
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
