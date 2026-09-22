import express from "express";

import {
  createAccess,
  getMyAccess,
  getAccessById,
  getAccessByUserAndBusiness,
  getBusinessAccess,
  updateAccess,
  removeAccess,
} from "./erpAccess.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

import { ROLE_CODES } from "../roles/role.constants.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

/**
 * Get logged-in customer's ERP accesses
 *
 * GET /api/erp-access/my
 */
router.get(
  "/my",
  authenticate,
  getMyAccess
);


/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/**
 * Create ERP access manually
 *
 * POST /api/erp-access
 */
router.post(
  "/",
  authenticate,
  requireRole(ROLE_CODES.TRANZOOP_ADMIN),
  createAccess
);


/**
 * Get ERP access by ID
 *
 * GET /api/erp-access/:id
 */
router.get(
  "/:id",
  authenticate,
  requireRole(ROLE_CODES.TRANZOOP_ADMIN),
  getAccessById
);


/**
 * Find access by user + ERP + business
 *
 * GET /api/erp-access/user/:userId/erp/:erpCode/business/:businessId
 */
router.get(
  "/user/:userId/erp/:erpCode/business/:businessId",
  authenticate,
  requireRole(ROLE_CODES.TRANZOOP_ADMIN),
  getAccessByUserAndBusiness
);


/**
 * Get all access records for a business
 *
 * GET /api/erp-access/erp/:erpCode/business/:businessId
 */
router.get(
  "/erp/:erpCode/business/:businessId",
  authenticate,
  requireRole(ROLE_CODES.TRANZOOP_ADMIN),
  getBusinessAccess
);


/**
 * Update ERP access
 *
 * PATCH /api/erp-access/:id
 */
router.patch(
  "/:id",
  authenticate,
  requireRole(ROLE_CODES.TRANZOOP_ADMIN),
  updateAccess
);


/**
 * Delete ERP access
 *
 * DELETE /api/erp-access/:id
 */
router.delete(
  "/:id",
  authenticate,
  requireRole(ROLE_CODES.TRANZOOP_ADMIN),
  removeAccess
);

export default router;