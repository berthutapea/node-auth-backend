const User = require("../user/model");
const { sendOTP, verifyOTP, deleteOTP } = require("../otp/controller");

const verifyUserEmail = async ({ email, otp }) => {
    try {
        const validIOTP = await verifyOTP({ email, otp });
        if (!validIOTP) {
            throw Error("Invalid code passed. Check your inbox.")
        }
        // now update user record to show verified.
        await User.updateOne({ email }, { verified: true });

        await deleteOTP(email);
        return;
    } catch (error) {
        throw error;
    }
}

const sendVerificationOTPEmail = async (email) => {
    try {
        // check if an account exits
        const exitingUser = await User.findOne({ email });
        if (!exitingUser) {
            throw Error("There's no account for the provided email.")
        }

        const otpDetails = {
            email,
            subject: "Email Verification",
            message: "Verify your email with the code below.",
            duration: 1,
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendVerificationOTPEmail, verifyUserEmail };
