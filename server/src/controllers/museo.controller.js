import Museo from "../models/museo.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getMuseos = async (req, res) => {
  try {
    // const { limit = 10, page = 1, search = "" } = req.query;
    // const pageNumber = parseInt(page, 10);
    // const offset = (pageNumber - 1) * limit;

    const { search = "" } = req.query;
    const [museos, total] = await Promise.all([
      Museo.findAll({ search }),
      Museo.countAll({ search }),
    ]);
    res.json({
      success: true,
      count: museos.length,
      museos,
      total,
      // currentPage: pageNumber,
      // totalPages: Math.ceil(total / limit),
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
