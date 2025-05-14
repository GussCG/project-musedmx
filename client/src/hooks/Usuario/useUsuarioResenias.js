import { useState } from "react";
import ReseniaService from "../../services/ReseniaServiceService";

export const useResenias = () => {
  const [error, setError] = useState(null);

  // Registrar Reseña
  const registrarResenia = async (resenia) => {
    setError(null);
    try {
      const response = await ReseniaService.registrarResenia(resenia);
      return response;
    } catch (error) { 
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  // Editar Reseña
  const editarResenia = async (resenia) => {
    // console.log(usuario);
    setError(null);
    try {
      const response = await ReseniaService.editarResenia(resenia);
      return response;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  // Eliminar Reseña
  const eliminarResenia = async (resenia) => {
	setError(null);
	try {
	  const response = await ReseniaService.eliminarResenia(resenia);
	  return response;
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
