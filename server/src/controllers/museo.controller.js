import Museo from "../models/museo.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getMuseos = async (req, res) => {
  try {
    const { search, tipo, tipos, alcaldias, sort, limit, page, isMapView } =
      req.query;

    // Limpieza de parámetros
    const cleanParams = {
      search: search && search !== "null" ? search : null,
      tipos: tipos ? tipos.split(",") : [],
      alcaldias: alcaldias ? alcaldias.split(",") : [],
      sort: sort || null,
      limit: isMapView === "true" ? null : limit ? parseInt(limit) : 12,
      page: isMapView === "true" ? null : page ? parseInt(page) : 1,
      isMapView: isMapView === "true",
    };

    // Si el tipo es "3" (populares), se establece un límite de 10 y se elimina la paginación por el momento que no hay logica para obtener museos populares
    if (tipo === "3") {
      cleanParams.limit = 10;
      cleanParams.page = 1;

      if (cleanParams.isMapView) {
        cleanParams.limit = 10;
        cleanParams.page = null;
      }
    }

    const result = await Museo.findAll(cleanParams);

    // Estructura de respuesta consistente
    const response = {
      success: true,
      data: {
        items: result.items,
        totalItems: result.totalItems,
        pagination: {
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          itemsPerPage: result.itemsPerPage,
        },
      },
    };

    res.json(response);
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS", error);
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

export const getMuseoById = async (req, res) => {
  try {
    const { id } = req.params;
    const museo = await Museo.findById({ id: id });
    res.json({
      success: true,
      id,
      museo,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEO_ID", error);
  }
};

export const getGaleriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const galeria = await Museo.findGaleriaById({ id: id });
    res.json({
      success: true,
      id,
      galeria,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_GALERIA_ID", error);
  }
};

export const getHorariosById = async (req, res) => {
  try {
    const { id } = req.params;
    const horarios = await Museo.findHorariosById({ id: id });

    res.json({
      success: true,
      id,
      horarios,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_HORARIOS_ID", error);
  }
};

export const getRedesById = async (req, res) => {
  try {
    const { id } = req.params;
    const redes = await Museo.findRedesById({ id: id });

    res.json({
      success: true,
      id,
      redes,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_REDES_ID", error);
  }
};
