import { registerUser, loginUser } from "./auth.service.js";
import {
  verifyRefreshToken,
  generateAccessToken,
} from "../../shared/jwt.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message:
        "Registration submitted successfully. Your account is pending approval.",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/mobile and password are required",
      });
    }

    const result = await loginUser(identifier, password);

    const accessCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      path: "/",
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("accessToken", result.accessToken, accessCookieOptions);

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        permissions: result.permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Logout failed",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // Read refresh token from HttpOnly cookie
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Create a new access token
    const accessToken = generateAccessToken({
      sub: decoded.sub,
    });

    // Set new access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

