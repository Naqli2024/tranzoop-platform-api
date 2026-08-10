import { successResponse } from "../../shared/apiResponse.js";
import { verifyOtpService } from "./auth.service.js";

export const verifyOtp = async (req, res, next) => {
  try {
    const result = await verifyOtpService(
      req.body.mobile,
      req.body.otp
    );

    return successResponse(
      res,
      "OTP verified successfully.",
      result
    );
  } catch (error) {
    next(error);
  }
};