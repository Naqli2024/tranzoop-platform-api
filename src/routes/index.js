import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import setupRoutes from "../modules/auth/setup.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/setup", setupRoutes);

export default router;