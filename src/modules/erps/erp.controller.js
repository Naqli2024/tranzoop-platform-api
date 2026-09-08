import {
  createErp,
  getAllErps,
  getPublicErps,
  getErpById,
  getErpByCode,
} from "./erp.service.js";

import { validateCreateErp } from "./erp.validation.js";

export const create = async (req, res) => {
  try {
    const validationError = validateCreateErp(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const erp = await createErp(req.body);

    return res.status(201).json({
      success: true,
      message: "ERP created successfully",
      data: erp,
    });
  } catch (error) {
    console.error("Create ERP error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create ERP",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const erps = await getAllErps();

    return res.status(200).json({
      success: true,
      message: "ERPs fetched successfully",
      data: erps,
    });
  } catch (error) {
    console.error("Get ERPs error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch ERPs",
    });
  }
};

export const getPublic = async (req, res) => {
  try {
    const erps = await getPublicErps();

    return res.status(200).json({
      success: true,
      message: "Public ERPs fetched successfully",
      data: erps,
    });
  } catch (error) {
    console.error("Get public ERPs error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch public ERPs",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const erp = await getErpById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "ERP fetched successfully",
      data: erp,
    });
  } catch (error) {
    console.error("Get ERP by ID error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch ERP",
    });
  }
};

export const getByCode = async (req, res) => {
  try {
    const erp = await getErpByCode(req.params.code);

    return res.status(200).json({
      success: true,
      message: "ERP fetched successfully",
      data: erp,
    });
  } catch (error) {
    console.error("Get ERP by code error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch ERP",
    });
  }
};