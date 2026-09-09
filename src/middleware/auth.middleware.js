import { verifyAccessToken } from "../shared/jwt.js";

export const authenticate = (req, res, next) => {
  try {
    // Read access token from HttpOnly cookie
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify access token
    const decoded = verifyAccessToken(token);

    // Make authenticated user available to next middleware/controller
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};

