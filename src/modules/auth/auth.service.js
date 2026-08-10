import Company from "../companies/company.model.js";
import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import OTP from "./otp.model.js";
import {
  sendOTP,
  verifyOTP,
} from "./otp.service.js";
import { hashPassword } from "../../shared/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  generateRegistrationToken,
} from "../../shared/jwt.js";

export const sendOtpService = async (mobile) => {

  const companyExists = await Company.findOne({ mobile });

  if (companyExists) {
    throw new Error("Mobile number is already registered.");
  }

  return await sendOTP(mobile, "REGISTER");
};

export const verifyOtpService = async (mobile, otp) => {

  await verifyOTP(mobile, otp, "REGISTER");

  const registrationToken =
    generateRegistrationToken(mobile);

  return {
    registrationToken,
  };
};