import express from "express";
const router = express.Router();
import {
  create,
  getByErp,
  getPublicByErpCode,
  getById,
  update,
  remove,
} from "./plan.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

import { requireRole } from "../../middleware/role.middleware.js";

// PUBLIC
router.get("/public/erp/:erpCode", getPublicByErpCode);

// ADMIN
router.post("/", authenticate, requireRole("TRANZOOP_ADMIN"), create);

router.get(
  "/erp/:erpId",
  authenticate,
  requireRole("TRANZOOP_ADMIN"),
  getByErp,
);

router.get("/:id", authenticate, requireRole("TRANZOOP_ADMIN"), getById);

router.put("/:id", authenticate, requireRole("TRANZOOP_ADMIN"), update);

router.delete("/:id", authenticate, requireRole("TRANZOOP_ADMIN"), remove);

export default router;
