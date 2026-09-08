import {
  createPlan,
  getPlansByErp,
  getPlansByErpCode,
  getPlanById,
  updatePlan,
  deletePlan,
} from "./plan.service.js";

import { validateCreatePlan, validateUpdatePlan } from "./plan.validation.js";

export const create = async (req, res) => {
  try {
    const validationError = validateCreatePlan(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const plan = await createPlan({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create plan",
    });
  }
};

export const getByErp = async (req, res) => {
  try {
    const plans = await getPlansByErp(req.params.erpId);

    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    console.error("Get plans by ERP error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch plans",
    });
  }
};

export const getPublicByErpCode = async (req, res) => {
  try {
    const plans = await getPlansByErpCode(req.params.erpCode);

    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    console.error("Get public plans error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch plans",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const plan = await getPlanById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    console.error("Get plan error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch plan",
    });
  }
};

export const update = async (req, res) => {
  try {
    const validationError = validateUpdatePlan(req.body);

    if (validationError) {
      const error = new Error(validationError);

      error.statusCode = 400;

      throw error;
    }

    const plan = await updatePlan(req.params.id, req.body, req.user.sub);

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const plan = await deletePlan(req.params.id, req.user.sub);

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete plan",
    });
  }
};
