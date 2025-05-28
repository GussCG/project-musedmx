import { pool } from "../db.js";

export default class Mod {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const query = `
                SELECT u.*
                FROM usuarios u
                JOIN moderador m ON u.usr_correo = m.usuarios_usr_correo
        `;
      const [rows] = await connection.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener moderadores:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async create(modData) {
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
        usr_tipo,
      } = modData;

      const query = `
            INSERT INTO usuarios (
                usr_correo,
                usr_nombre,
                usr_ap_paterno,
                usr_ap_materno,
                usr_contrasenia,
                usr_fecha_nac,
                usr_telefono,
                usr_tipo
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;
      const values = [
        usr_correo,
        usr_nombre,
        usr_ap_paterno,
        usr_ap_materno,
        usr_contrasenia,
        usr_fecha_nac,
        usr_telefono,
        usr_tipo,
      ];

      const [result] = await connection.query(query, values);
      await connection.commit();

      return {
        success: true,
        message: "Moderador creado",
      };
    } catch (error) {
      console.error("Error al crear el moderador:", error);
      await connection.rollback();

      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("El correo ya está registrado");
      }

      throw new Error("Error al crear moderador");
    } finally {
      connection.release();
    }
  }

  static async update(usr_correo, modData) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const data = { ...modData };
      delete data.usr_correo;
      delete data.usr_contrasenia;

      console.log("Datos a actualizar:", data);
      if (Object.keys(data).length > 0) {
        const campos = Object.keys(data);
        const setClauses = campos.map((campo) => `${campo} = ?`).join(", ");
        const query = `
                UPDATE usuarios
                SET ${setClauses}
                WHERE usr_correo = ?
            `;

        await connection.query(query, [...Object.values(data), usr_correo]);
      }

      await connection.commit();
      return {
        success: true,
        message: "Moderador actualizado",
      };
    } catch (error) {
      console.error("Error al actualizar moderador:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(usr_correo) {
    const connection = await pool.getConnection();
    try {
      const query = `
                DELETE FROM usuarios
                WHERE usr_correo = ?
            `;
      const [result] = await connection.query(query, [usr_correo]);
      return result;
    } catch (error) {
      console.error("Error al eliminar moderador:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByCorreo(usr_correo) {
    const connection = await pool.getConnection();
    try {
      const query = `
                SELECT u.*
                FROM usuarios u
                JOIN moderador m ON u.usr_correo = m.usuarios_usr_correo
                WHERE u.usr_correo = ?
            `;
      const [rows] = await connection.query(query, [usr_correo]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error al verificar moderador:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
