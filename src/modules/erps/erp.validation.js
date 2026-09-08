export const validateCreateErp = (data) => {
  const { name, code } = data;

  if (!name || !name.trim()) {
    return "ERP name is required";
  }

  if (!code || !code.trim()) {
    return "ERP code is required";
  }

  return null;
};