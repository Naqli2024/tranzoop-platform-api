import express from "express";

import {
  create,
  getAll,
  getPublic,
  getById,
  getByCode,
} from "./erp.controller.js";

const router = express.Router();

// Public marketplace routes
router.get("/public", getPublic);

router.get("/code/:code", getByCode);

// Admin/internal routes
router.get("/", getAll);

router.get("/:id", getById);

router.post("/", create);

export default router;