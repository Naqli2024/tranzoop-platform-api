import {
  createPurchase,
  getPurchaseById,
  getUserPurchases,
} from "./purchase.service.js";

/**
 * Create Purchase
 *
 * POST /api/purchases
 */
export const createPurchaseController = async (req, res) => {
  try {
    const { erpCode, planId, business } = req.body;

    const result = await createPurchase({
      erpCode,
      planId,
      business,
    });

    return res.status(201).json({
      success: true,
      message:
        result.erpAccess.status === "ACTIVE"
          ? "ERP purchase completed successfully"
          : "ERP business created. Payment is pending.",

      data: {
        purchase: result.purchase,
        user: {
          id: result.user._id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          mobile: result.user.mobile,
          roleId: result.user.roleId,
          status: result.user.status,
        },

        erp: result.erp,

        plan: result.plan,

        businessId: result.businessId,

        erpAccess: result.erpAccess,
      },
    });
  } catch (error) {
    console.error("Create purchase error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Purchase By ID
 *
 * GET /api/purchases/:id
 */
export const getPurchaseController = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await getPurchaseById(id);

    return res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    console.error("Get purchase error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Current User Purchases
 *
 * GET /api/purchases/my
 */
export const getMyPurchasesController = async (req, res) => {
  try {
    const userId = req.user.sub;

    const purchases = await getUserPurchases(userId);

    return res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    console.error("Get my purchases error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
