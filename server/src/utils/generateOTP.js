export const generateOTP = async () => {
	try {
		return Math.floor(1000 + Math.random() * 9000).toString();
  }
  catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Failed to generate OTP");
  }
}


