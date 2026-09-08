import Erp from "./erp.model.js";

export const createErp = async (data) => {
  const code = data.code.toLowerCase().trim();

  const existingErp = await Erp.findOne({ code });

  if (existingErp) {
    const error = new Error("ERP with this code already exists");
    error.statusCode = 409;
    throw error;
  }

  const erp = await Erp.create({
    name: data.name.trim(),
    code,

    description: data.description?.trim() || "",

    shortDescription:
      data.shortDescription?.trim() || "",

    icon: data.icon?.trim() || "",

    status: data.status || "ACTIVE",

    isPublic: data.isPublic ?? true,

    isFeatured: data.isFeatured ?? false,

    displayOrder: data.displayOrder ?? 0,
  });

  return erp;
};

export const getAllErps = async () => {
  return Erp.find()
    .sort({
      displayOrder: 1,
      createdAt: 1,
    })
    .lean();
};

export const getPublicErps = async () => {
  return Erp.find({
    status: "ACTIVE",
    isPublic: true,
  })
    .sort({
      displayOrder: 1,
      createdAt: 1,
    })
    .lean();
};

export const getErpById = async (erpId) => {
  const erp = await Erp.findById(erpId).lean();

  if (!erp) {
    const error = new Error("ERP not found");
    error.statusCode = 404;
    throw error;
  }

  return erp;
};

export const getErpByCode = async (code) => {
  const erp = await Erp.findOne({
    code: code.toLowerCase().trim(),
  }).lean();

  if (!erp) {
    const error = new Error("ERP not found");
    error.statusCode = 404;
    throw error;
  }

  return erp;
};