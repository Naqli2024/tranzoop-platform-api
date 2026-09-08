import mongoose from "mongoose";
import { ERP_CODES } from "./erp.constants.js";

const erpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(ERP_CODES),
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    icon: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

erpSchema.index({
  status: 1,
  isPublic: 1,
  displayOrder: 1,
});

const Erp = mongoose.model("Erp", erpSchema);

export default Erp;



