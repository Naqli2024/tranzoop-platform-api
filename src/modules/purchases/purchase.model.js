import mongoose from "mongoose";
import {
  PURCHASE_STATUS,
  PURCHASE_PAYMENT_STATUS,
} from "./purchase.constants.js";

const purchaseSchema = new mongoose.Schema(
  {
    // Platform customer
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // ERP
    erpCode: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Selected pricing plan
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },

    // ERP business created during purchase
    businessId: {
      type: String,
      default: null,
      index: true,
    },

    // Purchase status
    status: {
      type: String,
      enum: Object.values(PURCHASE_STATUS),
      default: PURCHASE_STATUS.PENDING,
      index: true,
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: Object.values(PURCHASE_PAYMENT_STATUS),
      default: PURCHASE_PAYMENT_STATUS.PENDING,
      index: true,
    },

    // Amount captured at purchase time
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

    // Customer mobile used during ERP registration
    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // ERP username used to create the ERP account
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // Store payment provider reference later
    paymentId: {
      type: String,
      default: null,
      index: true,
    },

    orderId: {
      type: String,
      default: null,
      index: true,
    },

    // Error information if ERP registration/payment fails
    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
