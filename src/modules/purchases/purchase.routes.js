import express from "express";

import {
  createPurchaseController,
  getPurchaseController,
  getMyPurchasesController,
} from "./purchase.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Customer Purchase
|--------------------------------------------------------------------------
*/

/**
 * Create a purchase
 *
 * POST /api/purchases
 *
 * This endpoint is intentionally public for the
 * marketplace purchase flow.
 */
router.post("/", createPurchaseController);

/**
 * Get logged-in user's purchases
 *
 * GET /api/purchases/my
 */
router.get("/my", authenticate, getMyPurchasesController);

/*
|--------------------------------------------------------------------------
| Purchase Details
|--------------------------------------------------------------------------
*/

/**
 * Get purchase by ID
 *
 * GET /api/purchases/:id
 */
router.get("/:id", authenticate, getPurchaseController);

export default router;
