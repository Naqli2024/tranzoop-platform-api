import mongoose from "mongoose";

const erpAccessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    businessId: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

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

const ErpAccess = mongoose.model(
  "ErpAccess",
  erpAccessSchema
);

export default ErpAccess;