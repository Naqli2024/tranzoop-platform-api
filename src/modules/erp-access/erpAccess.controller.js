import {
  createErpAccess,
  getUserErpAccess,
  getErpAccessById,
  findErpAccess,
  findBusinessErpAccess,
  updateErpAccess,
  deleteErpAccess,
} from "./erpAccess.service.js";

/**
 * Create ERP Access
 *
 * This endpoint is mainly for internal/admin use.
 * The actual customer purchase flow will later
 * create ErpAccess through purchase.service.js.
 */
export const createAccess = async (req, res) => {
  try {
    const {
      userId,
      erpCode,
      businessId,
      planId,
      paymentStatus,
      status,
      startDate,
      endDate,
      trialStartDate,
      trialEndDate,
    } = req.body;

    const access = await createErpAccess({
      userId,
      erpCode,
      businessId,
      planId,
      paymentStatus,
      status,
      startDate,
      endDate,
      trialStartDate,
      trialEndDate,
    });

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

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current logged-in user's ERP accesses
export const getMyAccess = async (req, res) => {
  try {
    const userId = req.user.sub;

    const accesses = await getUserErpAccess(userId);

    return res.status(200).json({
      success: true,
      data: accesses,
    });
  } catch (error) {
    console.error(
      "Get my ERP access error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get ERP access by ID
export const getAccessById = async (req, res) => {
  try {
    const { id } = req.params;

    const access = await getErpAccessById(id);

    return res.status(200).json({
      success: true,
      data: access,
    });
  } catch (error) {
    console.error(
      "Get ERP access by ID error:",
      error
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Find access by user + ERP + business
export const getAccessByUserAndBusiness = async (
  req,
  res
) => {
  try {
    const { userId, erpCode, businessId } =
      req.params;

    const access = await findErpAccess({
      userId,
      erpCode,
      businessId,
    });

    if (!access) {
      return res.status(404).json({
        success: false,
        message: "ERP access not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: access,
    });
  } catch (error) {
    console.error(
      "Find ERP access error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all users who have access to a particular ERP business
export const getBusinessAccess = async (
  req,
  res
) => {
  try {
    const { erpCode, businessId } = req.params;

    const accesses = await findBusinessErpAccess({
      erpCode,
      businessId,
    });

    return res.status(200).json({
      success: true,
      data: accesses,
    });
  } catch (error) {
    console.error(
      "Get business ERP access error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update ERP access
export const updateAccess = async (req, res) => {
  try {
    const { id } = req.params;

    const access = await updateErpAccess(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "ERP access updated successfully",
      data: access,
    });
  } catch (error) {
    console.error(
      "Update ERP access error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete ERP access
export const removeAccess = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteErpAccess(id);

    return res.status(200).json({
      success: true,
      message: "ERP access deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete ERP access error:",
      error
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};