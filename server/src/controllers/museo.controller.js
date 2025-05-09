import Museo from "../models/museo.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getMuseos = async (req, res) => {
  try {
    const { search, tipo, tipos, alcaldias, sort, limit } = req.query;
    // Si search es null se asigna un string vacio
    const searchValue = search || "";
    const tiposArray = tipos ? tipos.split(",") : [];
    const alcaldiasArray = alcaldias ? alcaldias.split(",") : [];

    let sortValue = sort;
    let limitNumber = limit ? parseInt(limit) : null;

    if (tipo === "3") {
      limitNumber = 10;
    }

    console.log("Params", {
      searchValue,
      tiposArray,
      alcaldiasArray,
      sortValue,
      limitNumber,
    });

    const museos = await Museo.findAll({
      search: searchValue,
      tipos: tiposArray,
      alcaldias: alcaldiasArray,
      sort: sortValue,
      limit: limitNumber,
    });

    res.json({
      success: true,
      count: museos.length,
      museos,
    });
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

export const createMuseo = async (req, res) => {
  try {
    const museo = await Museo.create(req.body);
    res.status(201).json(museo);
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_MUSEO", error);
  }
};
