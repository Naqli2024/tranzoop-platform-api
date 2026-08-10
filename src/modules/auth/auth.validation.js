/**
 * Register Validation
 */
export const validateRegister = (data) => {
  const errors = [];

  if (!data.companyName?.trim()) {
    errors.push("Company name is required.");
  }

  if (!data.firstName?.trim()) {
    errors.push("First name is required.");
  }

  if (!data.mobile?.trim()) {
    errors.push("Mobile number is required.");
  }

  if (data.mobile && !/^[6-9]\d{9}$/.test(data.mobile)) {
    errors.push("Invalid mobile number.");
  }

  if (data.email) {
    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(data.email)) {
      errors.push("Invalid email address.");
    }
  }

  if (!data.password) {
    errors.push("Password is required.");
  }

  if (data.password && data.password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  return errors;
};

/**
 * Login Validation
 */
export const validateLogin = (data) => {
  const errors = [];

  if (!data.mobile?.trim()) {
    errors.push("Mobile number is required.");
  }

  if (!data.password?.trim()) {
    errors.push("Password is required.");
  }

  return errors;
};