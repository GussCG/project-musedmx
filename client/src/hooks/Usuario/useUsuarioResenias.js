import { useState } from "react";
import axios from "axios";
import Resenia from "../../models/Usuario/Review";

import { BACKEND_URL } from "../../constants/api";

export const useResenias = ({ usr_correo } = {}) => {
	const [resenias, setResenias] = useState([]);
  const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

  // Registrar Reseña
  const registrarResenia = async (resenia) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/reviews/`;
      const response = await axios.post(endpoint, resenia, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });

      const nuevaResenia = new Resenia(response.data.resenia);
      setResenias((prevResenias) => [nuevaResenia, ...prevResenias]);

      return nuevaResenia;
    } catch (error) {
      console.error("Error al registrar reseña:", error);
      throw error;
    }
  };

  // Editar Reseña
  const editarResenia = async (resenia) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/reviews/`;
      const response = await axios.put(endpoint, resenia, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });
      const reseniaEditada = new Resenia(response.data.resenia);
      setResenias((prevResenias) =>
        prevResenias.map((r) => (r.id === reseniaEditada.id ? reseniaEditada : r))
      );
      return reseniaEditada;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar Reseña
  const eliminarResenia = async (usr_correo, resenia) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/reviews/`;
      const response = await axios.delete(endpoint, {
        data: { usr_correo, resenia },
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });
      const reseniaEliminada = new Resenia(response.data.resenia);
      setResenias((prevResenias) =>
        prevResenias.filter((r) => r.id !== reseniaEliminada.id)
      );
      return reseniaEliminada;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
    };
    return { registrarResenia, editarResenia, eliminarResenia, error };
};

export default useResenias;
