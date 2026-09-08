import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import setupRoutes from "../modules/auth/setup.routes.js";

import erpRoutes from "../modules/erps/erp.routes.js";
import planRoutes from "../modules/plans/plan.routes.js";
import erpAccessRoutes from "../modules/erp-access/erpAccess.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/setup", setupRoutes);

router.use("/erps", erpRoutes);
router.use("/plans", planRoutes);
router.use("/erp-access", erpAccessRoutes);

export default router;