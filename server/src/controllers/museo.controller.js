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
