import express from "express";
import User from "../users/user.model.js";
import { register, login, logout, refreshToken } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub)
      .select("-password")
      .populate("roleId", "name code permissions");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authenticated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.roleId?.code || null,
        permissions: user.roleId?.permissions || [],
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get authenticated user",
    });
  }
});

export default router;
