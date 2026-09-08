export const validateCreatePlan = (data) => {
  const { erpId, name, code, amount, billingCycle, durationDays } = data;

  if (!erpId) {
    return "ERP ID is required";
  }

  if (!name || !name.trim()) {
    return "Plan name is required";
  }

  if (!code || !code.trim()) {
    return "Plan code is required";
  }

  if (amount === undefined || amount === null) {
    return "Plan amount is required";
  }

  if (Number(amount) < 0) {
    return "Plan amount cannot be negative";
  }

  if (!billingCycle) {
    return "Billing cycle is required";
  }

  if (!["MONTHLY", "YEARLY"].includes(billingCycle)) {
    return "Invalid billing cycle";
  }

  if (!durationDays || Number(durationDays) <= 0) {
    return "Duration days must be greater than 0";
  }

  return null;
};

export const validateUpdatePlan = (data) => {
  const { name, code, amount, billingCycle, durationDays } = data;

  if (name !== undefined && (!name || !name.trim())) {
    return "Plan name cannot be empty";
  }

  if (code !== undefined && (!code || !code.trim())) {
    return "Plan code cannot be empty";
  }

  if (amount !== undefined && (amount === null || Number(amount) < 0)) {
    return "Plan amount cannot be negative";
  }

  if (
    billingCycle !== undefined &&
    !["MONTHLY", "YEARLY"].includes(billingCycle)
  ) {
    return "Invalid billing cycle";
  }

  if (durationDays !== undefined && Number(durationDays) <= 0) {
    return "Duration days must be greater than 0";
  }

  return null;
};
