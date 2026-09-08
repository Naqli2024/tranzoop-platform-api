import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
      default: null,
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACTIVE",
        "REJECTED",
        "SUSPENDED",
        "EXPIRED",
      ],
      default: "PENDING",
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Mobile is the unique customer identity
userSchema.index(
  { mobile: 1 },
  { unique: true }
);

// Email is unique when provided
userSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
  }
);

export default mongoose.model("User", userSchema);