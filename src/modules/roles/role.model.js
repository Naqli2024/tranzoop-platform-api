import mongoose from "mongoose";
import { ROLE_CODES } from "./role.constants.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(ROLE_CODES),
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    isSystem: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;