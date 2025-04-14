import Museo from "../models/museo.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getMuseos = async (req, res) => {
  try {
    const museos = await Museo.findAll(req.query);
    res.json({
      success: true,
      count: museos.length,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS", error);
  }
};

export const createMuseo = async (req, res) => {
  try {
    const museo = await Museo.create(req.body);
    res.status(201).json(museo);
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_MUSEO", error);
  }
};

export const getMuseosFiltrados = async (req, res) => {
  try {
    const {
      tematicas = [],
      alcaldias = [],
      precioMin = 0,
      precioMax = 100,
    } = req.query;

    const museos = await Museo.findWithFilters({
      tematicas: Array.isArray(tematicas) ? tematicas : [tematicas],
      alcaldias: Array.isArray(alcaldias) ? alcaldias : [alcaldias],
      precioMin: parseFloat(precioMin),
      precioMax: parseFloat(precioMax),
    });
    res.json({
      success: true,
      count: museos.length,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_FILTRADOS", error);
  }
};

export const getMuseosBusqueda = async (req, res) => {
  try {
    const { search } = req.query;
    const museos = await Museo.findWithFilters({ search: search });
    res.json({
      success: true,
      count: museos.length,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_BUSQUEDA", error);
  }
};

export const getMuseosNombres = async (req, res) => {
  try {
    const museos = await Museo.findAllNames({});
    res.json({
      success: true,
      count: museos.length,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_NOMBRES", error);
  }
};

// Aqui van mas funciones para los museos
export const getMuseoById = async (req, res) => {
  try {
	const { id } = req.query;
	const museo = await Museo.findById(id);
	if (!museo) {
	  return res.status(404).json({
		success: false,
		message: "Museo no encontrado",
	  });
	}
	res.json({
	  success: true,
	  museo,
	});
  } catch (error) {
	handleHttpError(res, "ERROR_GET_MUSEO_BY_ID", error);
  }
};

//* No sé si está bien :c
export const updateMuseo = async (req, res) => {
  try {
	const { id, fields } = req.query;
	const museo = await Museo.update(id, req.body);
	if (!museo) {
	  return res.status(404).json({
		success: false,
		message: "Museo no encontrado",
	  });
	}
	res.json({
	  success: true,
	  museo,
	});
  } catch (error) {
	handleHttpError(res, "ERROR_UPDATE_MUSEO", error);
  }
};
export const deleteMuseo = async (req, res) => {
  try {
	const { id } = req.query;
	const museo = await Museo.delete(id);
	if (!museo) {
	  return res.status(404).json({
		success: false,
		message: "Museo no encontrado",
	  });
	}
	res.json({
	  success: true,
	  message: "Museo eliminado",
	});
  } catch (error) {
	handleHttpError(res, "ERROR_DELETE_MUSEO", error);
  }
};