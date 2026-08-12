import { createUser } from "../users/user.service.js";
import User from "../users/user.model.js";
import { comparePassword } from "../../shared/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../shared/jwt.js";

export const registerUser = async (userData) => {
  return createUser(userData);
};


export const loginUser = async (identifier, password) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  const user = await User.findOne({
    $or: [
      { email: normalizedIdentifier },
      { mobile: identifier.trim() },
    ],
  })
    .select("+password")
    .populate("roleId", "name code permissions");

  if (!user) {
    const error = new Error(
      "Invalid email/mobile or password"
    );

    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "ACTIVE") {
    const error = new Error(
      "Your account is not active"
    );

    error.statusCode = 403;
    throw error;
  }

  const passwordMatched = await comparePassword(
    password,
    user.password
  );

  if (!passwordMatched) {
    const error = new Error(
      "Invalid email/mobile or password"
    );

    error.statusCode = 401;
    throw error;
  }

  if (!user.roleId) {
    const error = new Error(
      "No role assigned to this account"
    );

    error.statusCode = 403;
    throw error;
  }

  const tokenPayload = {
    sub: user._id.toString(),
    role: user.roleId.code,
    permissions: user.roleId.permissions || [],
  };

  const accessToken = generateAccessToken(tokenPayload);

  const refreshToken = generateRefreshToken({
    sub: user._id.toString(),
  });

  user.lastLoginAt = new Date();

  await user.save();

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      role: user.roleId.code,
    },
    permissions: user.roleId.permissions || [],
    accessToken,
    refreshToken,
  };
};