import {
  createErpAccess,
  getUserErpAccess,
  getUserErpAccessByCode,
  getErpAccessById,
} from "./erpAccess.service.js";

import {
  validateCreateErpAccess,
} from "./erpAccess.validation.js";

export const create = async (req, res) => {
  try {
    const validationError =
      validateCreateErpAccess(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const access = await createErpAccess(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "ERP access created successfully",
      data: access,
    });
  } catch (error) {
    console.error(
      "Create ERP access error:",
      error
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to create ERP access",
    });
  }
};

export const getMyAccess = async (req, res) => {
  try {
    /*
      This assumes your authentication middleware
      attaches the logged-in user to req.user.
    */

    const userId = req.user._id;

    const access = await getUserErpAccess(userId);

    return res.status(200).json({
      success: true,
      message: "ERP access fetched successfully",
      data: access,
    });
  } catch (error) {
    console.error(
      "Get my ERP access error:",
      error
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch ERP access",
    });
  }
};

export const getMyAccessByCode = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const access =
      await getUserErpAccessByCode(
        userId,
        req.params.erpCode
      );

    return res.status(200).json({
      success: true,
      message: "ERP access fetched successfully",
      data: access,
    });
  } catch (error) {
    console.error(
      "Get ERP access by code error:",
      error
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch ERP access",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const access = await getErpAccessById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "ERP access fetched successfully",
      data: access,
    });
  } catch (error) {
    console.error(
      "Get ERP access error:",
      error
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch ERP access",
    });
  }
};