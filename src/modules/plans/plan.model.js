import mongoose from "mongoose";
import {
  BILLING_CYCLES,
  PLAN_STATUS,
} from "./plan.constants.js";

const planSchema = new mongoose.Schema(
  {
    erpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Erp",
      required: true,
      index: true,
    },

    erpCode: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    billingCycle: {
      type: String,
      enum: Object.values(BILLING_CYCLES),
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },

    trialDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    features: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(PLAN_STATUS),
      default: PLAN_STATUS.ACTIVE,
      index: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Same plan code cannot exist twice for the same ERP
planSchema.index(
  { erpId: 1, code: 1 },
  { unique: true }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;