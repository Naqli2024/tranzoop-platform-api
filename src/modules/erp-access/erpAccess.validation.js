export const validateCreateErpAccess = (data) => {
  const { userId, erpCode, businessId } = data;

  if (!userId) {
    return "User ID is required";
  }

  if (!erpCode || !erpCode.trim()) {
    return "ERP code is required";
  }

  if (!businessId || !businessId.trim()) {
    return "Business ID is required";
  }

  return null;
};
