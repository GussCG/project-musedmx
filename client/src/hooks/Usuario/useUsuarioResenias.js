import { useState } from "react";
import ReseniaService from "../../services/ReseniaServiceService";

export const useResenias = () => {
  const [error, setError] = useState(null);

  // Registrar Reseña
  const registrarResenia = async (resenia) => {
    setError(null);
    try {
      return await ReseniaService.registrarResenia(resenia);
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
      return await ReseniaService.editarResenia(resenia);
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
	  return await ReseniaService.eliminarResenia(resenia);
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
