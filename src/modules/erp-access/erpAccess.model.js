import mongoose from "mongoose";
import {
  ERP_ACCESS_STATUS,
  ERP_PAYMENT_STATUS,
} from "./erpAccess.constants.js";

const erpAccessSchema = new mongoose.Schema(
  {
    // Platform User ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ERP identifier
    // Example: transport, tyre
    erpCode: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // ID of the Business document inside the ERP database
    businessId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Selected Platform pricing plan
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(ERP_PAYMENT_STATUS),
      default: ERP_PAYMENT_STATUS.PENDING,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ERP_ACCESS_STATUS),
      default: ERP_ACCESS_STATUS.PENDING,
      index: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    trialStartDate: {
      type: Date,
      default: null,
    },

    trialEndDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Same customer cannot have duplicate access
// to the same ERP business.
erpAccessSchema.index(
  {
    userId: 1,
    erpCode: 1,
    businessId: 1,
  },
  {
    unique: true,
  }
);

const ErpAccess = mongoose.model("ErpAccess", erpAccessSchema);

export default ErpAccess;