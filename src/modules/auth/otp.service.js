import OTP from "./otp.model.js";

/**
 * Generate 6 Digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP
 */
export const sendOTP = async (mobile, purpose = "REGISTER") => {
  // Remove previous unverified OTPs
  await OTP.deleteMany({
    mobile,
    purpose,
  });

  const otp = generateOTP();

  const otpData = await OTP.create({
    mobile,
    otp,
    purpose,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 Minutes
  });

  return {
    success: true,
    message: "OTP sent successfully.",
    data: {
      mobile,
      otp, // Remove this in Production
      expiresAt: otpData.expiresAt,
    },
  };
};

/**
 * Verify OTP
 */
export const verifyOTP = async (mobile, otp, purpose = "REGISTER") => {
  const otpData = await OTP.findOne({
    mobile,
    purpose,
  });

  if (!otpData) {
    throw new Error("OTP not found.", 404);
  }

  if (otpData.isVerified) {
    throw new Error("OTP already verified.");
  }

  if (otpData.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otpData._id });
    throw new Error("OTP has expired.");
  }

  if (otpData.attempts >= 5) {
    await OTP.deleteOne({ _id: otpData._id });

    throw new Error("Maximum OTP attempts exceeded. Please request a new OTP.");
  }

  otpData.attempts += 1;

  if (otpData.otp !== otp) {
    await otpData.save();
    throw new Error("Invalid OTP.");
  }

  otpData.isVerified = true;

  await otpData.save();

  return {
    success: true,
    message: "OTP verified successfully.",
  };
};

/**
 * Resend OTP
 */
export const resendOTP = async (mobile, purpose = "REGISTER") => {
  return sendOTP(mobile, purpose);
};
