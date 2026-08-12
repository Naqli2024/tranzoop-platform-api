import User from "./user.model.js";
import { hashPassword } from "../../shared/password.js";

export const findUserByEmail = async (email) => {
  return User.findOne({
    email: email.toLowerCase().trim(),
  });
};

export const findUserByMobile = async (mobile) => {
  return User.findOne({
    mobile: mobile.trim(),
  });
};

export const createUser = async ({
  firstName,
  lastName,
  email,
  mobile,
  password,
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedMobile = mobile.trim();

  const existingEmail = await findUserByEmail(normalizedEmail);

  if (existingEmail) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const existingMobile = await findUserByMobile(normalizedMobile);

  if (existingMobile) {
    const error = new Error("Mobile number already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName?.trim() || "",
    email: normalizedEmail,
    mobile: normalizedMobile,
    password: hashedPassword,

    // VERY IMPORTANT
    status: "PENDING",

    // No role until approval
    roleId: null,
  });

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    status: user.status,
  };
};