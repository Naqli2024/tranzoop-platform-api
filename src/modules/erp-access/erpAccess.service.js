import mongoose from "mongoose";

import ErpAccess from "./erpAccess.model.js";
import Erp from "../erps/erp.model.js";
import User from "../users/user.model.js";

export const createErpAccess = async (data) => {
  const { userId, erpCode, businessId, status = "ACTIVE" } = data;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    throw error;
  }

  // Check user
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Check ERP
  const normalizedErpCode = erpCode.toLowerCase().trim();

  const erp = await Erp.findOne({
    code: normalizedErpCode,
    status: "ACTIVE",
  });

  if (!erp) {
    const error = new Error("Active ERP not found");

    error.statusCode = 404;
    throw error;
  }

  // Check duplicate access
  const existingAccess = await ErpAccess.findOne({
    userId,
    erpCode: normalizedErpCode,
    businessId: businessId.trim(),
  });

  if (existingAccess) {
    const error = new Error(
      "ERP access already exists for this user and business",
    );

    error.statusCode = 409;
    throw error;
  }

  const access = await ErpAccess.create({
    userId,
    erpCode: normalizedErpCode,
    businessId: businessId.trim(),
    status,
  });

  return access;
};

export const getUserErpAccess = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    throw error;
  }

  return ErpAccess.find({
    userId,
    status: "ACTIVE",
  })
    .sort({
      createdAt: -1,
    })
    .lean();
};

export const getUserErpAccessByCode = async (userId, erpCode) => {
  const normalizedErpCode = erpCode.toLowerCase().trim();

  return ErpAccess.find({
    userId,
    erpCode: normalizedErpCode,
    status: "ACTIVE",
  })
    .sort({
      createdAt: -1,
    })
    .lean();
};

export const getErpAccessById = async (accessId) => {
  if (!mongoose.Types.ObjectId.isValid(accessId)) {
    const error = new Error("Invalid ERP access ID");
    error.statusCode = 400;
    throw error;
  }

  const access = await ErpAccess.findById(accessId).lean();

  if (!access) {
    const error = new Error("ERP access not found");
    error.statusCode = 404;
    throw error;
  }

  return access;
};
