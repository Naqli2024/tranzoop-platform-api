import Plan from "./plan.model.js";
import Erp from "../erps/erp.model.js";

export const createPlan = async ({
  erpId,
  name,
  code,
  description,
  amount,
  currency,
  billingCycle,
  durationDays,
  trialDays,
  features,
  status,
  isPublic,
  displayOrder,
  createdBy,
}) => {
  const erp = await Erp.findById(erpId);

  if (!erp) {
    const error = new Error("ERP not found");
    error.statusCode = 404;
    throw error;
  }

  if (erp.status !== "ACTIVE") {
    const error = new Error("Cannot create plan for inactive ERP");
    error.statusCode = 400;
    throw error;
  }

  const normalizedCode = code.trim().toUpperCase();

  const existingPlan = await Plan.findOne({
    erpId,
    code: normalizedCode,
  });

  if (existingPlan) {
    const error = new Error(
      "A plan with this code already exists for this ERP",
    );

    error.statusCode = 409;
    throw error;
  }

  const plan = await Plan.create({
    erpId,
    erpCode: erp.code,

    name: name.trim(),
    code: normalizedCode,

    description: description?.trim() || "",

    amount: Number(amount),

    currency: currency?.trim().toUpperCase() || "INR",

    billingCycle,

    durationDays: Number(durationDays),

    trialDays: Number(trialDays || 0),

    features: Array.isArray(features) ? features : [],

    status: status || "ACTIVE",

    isPublic: isPublic === undefined ? true : Boolean(isPublic),

    displayOrder: Number(displayOrder || 0),

    createdBy: createdBy || null,
  });

  return plan;
};

export const getPlansByErp = async (erpId, includeInactive = false) => {
  const filter = {
    erpId,
  };

  if (!includeInactive) {
    filter.status = "ACTIVE";
    filter.isPublic = true;
  }

  return Plan.find(filter)
    .sort({
      displayOrder: 1,
      amount: 1,
    })
    .lean();
};

export const getPlansByErpCode = async (erpCode, includeInactive = false) => {
  const filter = {
    erpCode: erpCode.toLowerCase().trim(),
  };

  if (!includeInactive) {
    filter.status = "ACTIVE";
    filter.isPublic = true;
  }

  return Plan.find(filter)
    .sort({
      displayOrder: 1,
      amount: 1,
    })
    .lean();
};

export const getPlanById = async (planId) => {
  const plan = await Plan.findById(planId)
    .populate("erpId", "name code status")
    .lean();

  if (!plan) {
    const error = new Error("Plan not found");
    error.statusCode = 404;
    throw error;
  }

  return plan;
};

export const updatePlan = async (planId, data, updatedBy) => {
  const plan = await Plan.findById(planId);

  if (!plan) {
    const error = new Error("Plan not found");
    error.statusCode = 404;
    throw error;
  }

  // If ERP is being changed, verify the new ERP
  if (data.erpId && data.erpId !== plan.erpId.toString()) {
    const erp = await Erp.findById(data.erpId);

    if (!erp) {
      const error = new Error("ERP not found");
      error.statusCode = 404;
      throw error;
    }

    if (erp.status !== "ACTIVE") {
      const error = new Error("Cannot assign plan to inactive ERP");
      error.statusCode = 400;
      throw error;
    }
  }

  const newErpId = data.erpId || plan.erpId;

  const newCode = data.code ? data.code.trim().toUpperCase() : plan.code;

  // Check duplicate plan code within same ERP
  const duplicatePlan = await Plan.findOne({
    _id: { $ne: planId },
    erpId: newErpId,
    code: newCode,
  });

  if (duplicatePlan) {
    const error = new Error(
      "A plan with this code already exists for this ERP",
    );

    error.statusCode = 409;
    throw error;
  }

  if (data.erpId) {
    plan.erpId = data.erpId;

    const erp = await Erp.findById(data.erpId);

    plan.erpCode = erp.code;
  }

  if (data.name !== undefined) {
    plan.name = data.name.trim();
  }

  if (data.code !== undefined) {
    plan.code = data.code.trim().toUpperCase();
  }

  if (data.description !== undefined) {
    plan.description = data.description?.trim() || "";
  }

  if (data.amount !== undefined) {
    plan.amount = Number(data.amount);
  }

  if (data.currency !== undefined) {
    plan.currency = data.currency.trim().toUpperCase();
  }

  if (data.billingCycle !== undefined) {
    plan.billingCycle = data.billingCycle;
  }

  if (data.durationDays !== undefined) {
    plan.durationDays = Number(data.durationDays);
  }

  if (data.trialDays !== undefined) {
    plan.trialDays = Number(data.trialDays);
  }

  if (data.features !== undefined) {
    plan.features = Array.isArray(data.features) ? data.features : [];
  }

  if (data.status !== undefined) {
    plan.status = data.status;
  }

  if (data.isPublic !== undefined) {
    plan.isPublic = Boolean(data.isPublic);
  }

  if (data.displayOrder !== undefined) {
    plan.displayOrder = Number(data.displayOrder);
  }

  plan.updatedBy = updatedBy;

  await plan.save();

  return plan;
};

export const deletePlan = async (planId, updatedBy) => {
  const plan = await Plan.findById(planId);

  if (!plan) {
    const error = new Error("Plan not found");
    error.statusCode = 404;
    throw error;
  }

  if (plan.status === "INACTIVE") {
    const error = new Error("Plan is already inactive");

    error.statusCode = 400;
    throw error;
  }

  plan.status = "INACTIVE";
  plan.isPublic = false;
  plan.updatedBy = updatedBy;

  await plan.save();

  return plan;
};
