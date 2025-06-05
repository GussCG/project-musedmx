import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { BACKEND_URL } from "../../constants/api";
import axios from "axios";

export const useOTP = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generarOTP = async (correo = user?.usr_correo) => {
    if (!correo) {
      setError("Correo no proporcionado");
      return;
    }
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/auth/generar-otp`;
      console.log("Generando OTP para el correo:", correo);
      console.log("Endpoint:", endpoint);
      const response = await axios.post(endpoint, {
        usr_correo: correo,
      });
      return response.data;
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  const verificarOTP = async (otp, correo = user?.usr_correo) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/auth/verificar-otp`;
      const response = await axios.post(endpoint, {
        usr_correo: correo,
        otp: otp,
      });
      return response.data;
    } catch (error) {
      console.error("Error al verificar OTP:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    generarOTP,
    verificarOTP,
    loading,
    error,
  };
};
