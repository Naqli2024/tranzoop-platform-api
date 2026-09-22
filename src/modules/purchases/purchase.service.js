import axios from "axios";

import Purchase from "./purchase.model.js";
import {
  PURCHASE_STATUS,
  PURCHASE_PAYMENT_STATUS,
} from "./purchase.constants.js";

import Erp from "../erps/erp.model.js";
import Plan from "../plans/plan.model.js";
import User from "../users/user.model.js";
import Role from "../roles/role.model.js";

import { createErpAccess } from "../erp-access/erpAccess.service.js";

import { hashPassword } from "../../shared/password.js";
import { ROLE_CODES } from "../roles/role.constants.js";

/*
|--------------------------------------------------------------------------
| ERP API Configuration
|--------------------------------------------------------------------------
*/

const ERP_API_CONFIG = {
  transport: {
    baseUrl: process.env.TRANSPORT_API_URL,
    registerEndpoint: "/business/register",
    verifyEndpoint: "/business/verify-mobile",
  },

  tyre: {
    baseUrl: process.env.TYRE_API_URL,
    registerEndpoint: "/business/register",
    verifyEndpoint: "/business/verify-mobile",
  },
};

/*
|--------------------------------------------------------------------------
| Helper: Get ERP API Configuration
|--------------------------------------------------------------------------
*/

const getErpApiConfig = (erpCode) => {
  const config = ERP_API_CONFIG[erpCode.toLowerCase()];

  if (!config) {
    throw new Error(`ERP integration not configured for: ${erpCode}`);
  }

  if (!config.baseUrl) {
    throw new Error(`API URL not configured for ERP: ${erpCode}`);
  }

  return config;
};

/*
|--------------------------------------------------------------------------
| Helper: Register Business in ERP
|--------------------------------------------------------------------------
*/

const registerBusinessInErp = async ({ erpCode, business }) => {
  const config = getErpApiConfig(erpCode);

  const url = `${config.baseUrl}${config.registerEndpoint}`;

  try {
    const response = await axios.post(url, business, {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (
      !response.data ||
      !response.data.business ||
      !response.data.business._id
    ) {
      throw new Error("ERP registration response does not contain business ID");
    }

    return {
      response: response.data,
      businessId: response.data.business._id.toString(),
      otp: response.data.business.otp,
    };
  } catch (error) {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "ERP business registration failed";

      throw new Error(message);
    }

    throw new Error(
      error.message || "Unable to connect to ERP registration service",
    );
  }
};

const verifyBusinessInErp = async ({ erpCode, mobile, otp }) => {
  const config = getErpApiConfig(erpCode);

  const url = `${config.baseUrl}${config.verifyEndpoint}`;

  const response = await axios.post(
    url,
    { mobile, otp },
    {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Helper: Find or Create Platform User
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| One mobile = one Platform User.
|
| If the same mobile purchases:
|
| Transport → reuse Platform User
| Tyre      → reuse same Platform User
|
|--------------------------------------------------------------------------
*/

const findOrCreatePlatformUser = async ({ mobile, username, password }) => {
  let user = await User.findOne({
    mobile,
  });

  if (user) {
    return {
      user,
      created: false,
    };
  }

  const erpCustomerRole = await Role.findOne({
    code: ROLE_CODES.ERP_CUSTOMER,
  });

  if (!erpCustomerRole) {
    throw new Error("ERP_CUSTOMER role not found");
  }

  const hashedPassword = await hashPassword(password);

  user = await User.create({
    firstName: username,
    lastName: "",
    email: null,
    mobile,
    password: hashedPassword,
    roleId: erpCustomerRole._id,
    status: "ACTIVE",
  });

  return {
    user,
    created: true,
  };
};

/*
|--------------------------------------------------------------------------
| Main Purchase Service
|--------------------------------------------------------------------------
*/

export const createPurchase = async ({ erpCode, planId, business }) => {
  /*
  |--------------------------------------------------------------------------
  | Validate basic input
  |--------------------------------------------------------------------------
  */

  if (!erpCode) {
    throw new Error("ERP code is required");
  }

  if (!planId) {
    throw new Error("Plan ID is required");
  }

  if (!business) {
    throw new Error("Business details are required");
  }

  if (!business.mobile) {
    throw new Error("Business mobile is required");
  }

  if (!business.username) {
    throw new Error("Business username is required");
  }

  if (!business.password) {
    throw new Error("Business password is required");
  }

  /*
  |--------------------------------------------------------------------------
  | Normalize ERP code
  |--------------------------------------------------------------------------
  */

  const normalizedErpCode = erpCode.toLowerCase().trim();

  /*
  |--------------------------------------------------------------------------
  | Validate ERP
  |--------------------------------------------------------------------------
  */

  const erp = await Erp.findOne({
    code: normalizedErpCode,
    status: "ACTIVE",
  });

  if (!erp) {
    throw new Error("ERP not found or inactive");
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Plan
  |--------------------------------------------------------------------------
  */

  const plan = await Plan.findOne({
    _id: planId,
    erpId: erp._id,
    erpCode: normalizedErpCode,
    status: "ACTIVE",
    isPublic: true,
  });

  if (!plan) {
    throw new Error("Selected plan is not available for this ERP");
  }

  /*
  |--------------------------------------------------------------------------
  | Create initial Purchase record
  |--------------------------------------------------------------------------
  */

  const purchase = await Purchase.create({
    userId: null,
    erpCode: normalizedErpCode,
    planId: plan._id,
    businessId: null,
    status: PURCHASE_STATUS.PENDING,
    paymentStatus:
      plan.amount === 0
        ? PURCHASE_PAYMENT_STATUS.FREE_TRIAL
        : PURCHASE_PAYMENT_STATUS.PENDING,
    amount: plan.amount,
    currency: plan.currency,
    mobile: business.mobile,
    username: business.username,
  });

  /*
  |--------------------------------------------------------------------------
  | Register Business in ERP
  |--------------------------------------------------------------------------
  */

  let registrationResult;

  try {
    registrationResult = await registerBusinessInErp({
      erpCode: normalizedErpCode,
      business,
    });
  } catch (error) {
    purchase.status = PURCHASE_STATUS.FAILED;

    purchase.failureReason = error.message;

    await purchase.save();

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Business ID
  |--------------------------------------------------------------------------
  */

  const businessId = registrationResult.businessId;

  purchase.businessId = businessId;

  purchase.status = PURCHASE_STATUS.BUSINESS_CREATED;

  await purchase.save();

  /*
  |--------------------------------------------------------------------------
  | Find or Create Platform User
  |--------------------------------------------------------------------------
  */

  let platformUser;

  try {
    const userResult = await findOrCreatePlatformUser({
      mobile: business.mobile,
      username: business.username,
      password: business.password,
    });

    platformUser = userResult.user;
  } catch (error) {
    purchase.status = PURCHASE_STATUS.FAILED;

    purchase.failureReason = error.message;

    await purchase.save();

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Save Platform User ID
  |--------------------------------------------------------------------------
  */

  purchase.userId = platformUser._id;

  await purchase.save();

  /*
  |--------------------------------------------------------------------------
  | Determine Payment / Trial
  |--------------------------------------------------------------------------
  */

  const now = new Date();

  let paymentStatus = PURCHASE_PAYMENT_STATUS.PENDING;

  let accessStatus = "PENDING";

  let startDate = null;
  let endDate = null;

  let trialStartDate = null;
  let trialEndDate = null;

  /*
  |--------------------------------------------------------------------------
  | FREE PLAN / FREE TRIAL
  |--------------------------------------------------------------------------
  */

  if (plan.amount === 0 || plan.trialDays > 0) {
    paymentStatus = PURCHASE_PAYMENT_STATUS.FREE_TRIAL;

    accessStatus = "ACTIVE";

    trialStartDate = now;

    trialEndDate = new Date(
      now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000,
    );

    startDate = now;
    endDate = trialEndDate;
  }

  /*
  |--------------------------------------------------------------------------
  | PAID PLAN
  |--------------------------------------------------------------------------
  |
  | Payment integration will be added later.
  |
  | For now:
  |
  | PENDING payment
  | PENDING access
  |
  |--------------------------------------------------------------------------
  */

  if (plan.amount > 0 && plan.trialDays === 0) {
    paymentStatus = PURCHASE_PAYMENT_STATUS.PENDING;

    accessStatus = "PENDING";
  }

  /*
  |--------------------------------------------------------------------------
  | Create ERP Access
  |--------------------------------------------------------------------------
  */

  let erpAccess;

  try {
    erpAccess = await createErpAccess({
      userId: platformUser._id,
      erpCode: normalizedErpCode,
      businessId,
      planId: plan._id,
      paymentStatus,
      status: accessStatus,
      startDate,
      endDate,
      trialStartDate,
      trialEndDate,
    });
  } catch (error) {
    purchase.status = PURCHASE_STATUS.FAILED;

    purchase.failureReason = error.message;

    await purchase.save();

    throw error;
  }

  /* 
|--------------------------------------------------------------------------
| Verify Business in ERP
|--------------------------------------------------------------------------
*/

if (accessStatus === "ACTIVE") {
  try {
    await verifyBusinessInErp({
      erpCode: normalizedErpCode,
      mobile: business.mobile,
      otp: registrationResult.otp,
    });
  } catch (error) {
    purchase.status = PURCHASE_STATUS.FAILED;
    purchase.failureReason = error.message;

    await purchase.save();

    throw error;
  }
}

  /*
  |--------------------------------------------------------------------------
  | Final Purchase Status
  |--------------------------------------------------------------------------
  */

  if (paymentStatus === PURCHASE_PAYMENT_STATUS.FREE_TRIAL) {
    purchase.status = PURCHASE_STATUS.COMPLETED;

    purchase.paymentStatus = PURCHASE_PAYMENT_STATUS.FREE_TRIAL;
  } else {
    purchase.status = PURCHASE_STATUS.PAYMENT_PENDING;

    purchase.paymentStatus = PURCHASE_PAYMENT_STATUS.PENDING;
  }

  await purchase.save();

  /*
  |--------------------------------------------------------------------------
  | Return Result
  |--------------------------------------------------------------------------
  */

  return {
    purchase,
    user: platformUser,
    erpAccess,
    erp: {
      id: erp._id,
      name: erp.name,
      code: erp.code,
    },
    plan,
    businessId,
  };
};

/*
|--------------------------------------------------------------------------
| Get Purchase By ID
|--------------------------------------------------------------------------
*/

export const getPurchaseById = async (purchaseId) => {
  const purchase = await Purchase.findById(purchaseId)
    .populate("userId", "firstName lastName mobile email")
    .populate("planId");

  if (!purchase) {
    throw new Error("Purchase not found");
  }

  return purchase;
};

/*
|--------------------------------------------------------------------------
| Get User Purchases
|--------------------------------------------------------------------------
*/

export const getUserPurchases = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await Purchase.find({
    userId,
  })
    .populate("planId")
    .sort({
      createdAt: -1,
    });
};
