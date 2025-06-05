import { pool } from "../db.js";

export default class OTP {
  static async create({ usr_correo, otp }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const query = `
            REPLACE INTO otp 
                (otp_usr_correo, otp_codigo)
            VALUES (?, ?)
        `;
      const [result] = await connection.query(query, [usr_correo, otp]);
      await connection.commit();

      return {
        success: true,
        message: "OTP creado exitosamente",
        data: {
          usr_correo,
          otp,
        },
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error al crear OTP:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findOne({ usr_correo, otp }) {
    const connection = await pool.getConnection();
    try {
      const query = `
            SELECT * FROM otp 
            WHERE otp_usr_correo = ? AND otp_codigo = ?
        `;
      const [rows] = await connection.query(query, [usr_correo, otp]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error al buscar OTP:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteOne({ usr_correo, otp }) {
    const connection = await pool.getConnection();
    try {
      const query = `
            DELETE FROM otp 
            WHERE otp_usr_correo = ? AND otp_codigo = ?
        `;
      const [result] = await connection.query(query, [usr_correo, otp]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar OTP:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findOneByCorreo({ usr_correo }) {
    const connection = await pool.getConnection();
    try {
      const query = `
            SELECT * FROM otp 
            WHERE otp_usr_correo = ?
        `;
      const [rows] = await connection.query(query, [usr_correo]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error al buscar OTP por correo:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
