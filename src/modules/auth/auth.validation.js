export const validateRegister = (data) => {
  const errors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = "First name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  }

  if (!data.mobile?.trim()) {
    errors.mobile = "Mobile number is required";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password =
      "Password must be at least 8 characters";
  }

  return errors;
};