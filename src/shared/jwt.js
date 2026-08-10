import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

/**
 * Generate Registration Token
 * Valid for 10 minutes after OTP verification
 */
export const generateRegistrationToken = (mobile) => {
  return jwt.sign(
    {
      mobile,
      type: "REGISTER",
    },
    config.jwtSecret,
    {
      expiresIn: "10m",
    }
  );
};

// Generate Access Token
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      companyId: user.companyId,
      roleId: user.roleId,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
};

// Generate Refresh Token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
    },
    config.refreshTokenSecret,
    {
      expiresIn: config.refreshTokenExpiresIn,
    }
  );
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.refreshTokenSecret);
};