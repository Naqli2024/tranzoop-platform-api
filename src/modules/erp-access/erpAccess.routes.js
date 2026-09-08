import express from "express";

import {
  create,
  getMyAccess,
  getMyAccessByCode,
  getById,
} from "./erpAccess.controller.js";

const router = express.Router();

/*
  IMPORTANT:
  Add your existing authentication middleware
  to these routes.

  Example:

  router.get("/me", authMiddleware, getMyAccess);

  Use the actual middleware name from your project.
*/

// Current route definitions
router.get("/me", getMyAccess);

router.get(
  "/me/:erpCode",
  getMyAccessByCode
);

router.get("/:id", getById);

router.post("/", create);

export default router;