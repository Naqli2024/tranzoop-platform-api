import ErpAccess from "./erpAccess.model.js";

// Create ERP access
export const createErpAccess = async ({
  userId,
  erpCode,
  businessId,
  planId,
  paymentStatus = "PENDING",
  status = "PENDING",
  startDate = null,
  endDate = null,
  trialStartDate = null,
  trialEndDate = null,
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!erpCode) {
    throw new Error("ERP code is required");
  }

  if (!businessId) {
    throw new Error("Business ID is required");
  }

  if (!planId) {
    throw new Error("Plan ID is required");
  }

  const normalizedErpCode = erpCode.toLowerCase().trim();

  // Check duplicate access
  const existingAccess = await ErpAccess.findOne({
    userId,
    erpCode: normalizedErpCode,
    businessId,
  });

  if (existingAccess) {
    throw new Error("ERP access already exists for this business");
  }

  const erpAccess = await ErpAccess.create({
    userId,
    erpCode: normalizedErpCode,
    businessId,
    planId,
    paymentStatus,
    status,
    startDate,
    endDate,
    trialStartDate,
    trialEndDate,
  });

  return erpAccess;
};

// Get all ERP accesses for a Platform User
 export const getUserErpAccess = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const accesses = await ErpAccess.find({
    userId,
  })
    .populate("planId")
    .sort({ createdAt: -1 });

  return accesses;
};

// Get single ERP access by ID
export const getErpAccessById = async (id) => {
  if (!id) {
    throw new Error("ERP access ID is required");
  }

  const access = await ErpAccess.findById(id)
    .populate("planId")
    .populate("userId", "firstName lastName mobile email roleId status");

  if (!access) {
    throw new Error("ERP access not found");
  }

  return access;
};

// Find ERP access by Platform User + ERP + Business
export const findErpAccess = async ({ userId, erpCode, businessId }) => {
  if (!userId || !erpCode || !businessId) {
    throw new Error("User ID, ERP code and business ID are required");
  }

  const access = await ErpAccess.findOne({
    userId,
    erpCode: erpCode.toLowerCase().trim(),
    businessId,
  }).populate("planId");

  return access;
};

// Find all accesses for one ERP business
export const findBusinessErpAccess = async ({ erpCode, businessId }) => {
  if (!erpCode || !businessId) {
    throw new Error("ERP code and business ID are required");
  }

  const accesses = await ErpAccess.find({
    erpCode: erpCode.toLowerCase().trim(),
    businessId,
  })
    .populate("userId", "firstName lastName mobile email roleId status")
    .populate("planId");

  return accesses;
};

// Update ERP access
export const updateErpAccess = async (id, updates) => {
  if (!id) {
    throw new Error("ERP access ID is required");
  }

  const access = await ErpAccess.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })
    .populate("planId")
    .populate("userId", "firstName lastName mobile email roleId status");

  if (!access) {
    throw new Error("ERP access not found");
  }

  return access;
};

/**
 * Delete ERP access
 *
 * This is mainly for admin/internal use.
 * Normally an expired/suspended access should
 * be updated instead of deleted.
 */
export const deleteErpAccess = async (id) => {
  if (!id) {
    throw new Error("ERP access ID is required");
  }

  const access = await ErpAccess.findByIdAndDelete(id);

  if (!access) {
    throw new Error("ERP access not found");
  }

  return access;
};
