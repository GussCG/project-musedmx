export const generateOTP = async () => {
  try {
    return Math.floor(100000 + Math.random() * 900000).toString();
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Failed to generate OTP");
  }
};
