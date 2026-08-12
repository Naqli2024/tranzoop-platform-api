import jwt from "jsonwebtoken";
import { env } from "../config/index.js";

// Generate Access Token
export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }
  );
};

// Generate Refresh Token
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }
  );
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  );
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  );
};