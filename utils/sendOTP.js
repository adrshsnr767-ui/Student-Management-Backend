const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// generate a 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// send OTP via email
const sendVerificationEmail = async (name, email, otp) => {
    try {
        await resend.emails.send({
            from: 'StudentManagementSystem <onboarding@resend.dev>',
            to: email,
            subject: 'Your Admin Login OTP',
            html: `
                <p>Hi ${name},</p>
                <p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>
            `,
        });
        return { success: true, message: "verification email sent successfully" };
    } catch (error) {
        console.log("error sending verification email", error);
        return { success: false, message: "failed to send verification email" };
    }
};

module.exports = { generateOtp, sendVerificationEmail };