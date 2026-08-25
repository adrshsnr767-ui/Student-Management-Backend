const Admin = require("../model/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateOtp, sendVerificationEmail } = require("../utils/sendOTP");


// register new admin 
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, secretkey } = req.body;
        const verifyExistingAdmin = await Admin.findOne({ email })
        if (verifyExistingAdmin) {
            return res.status(409).json({
                message: "Admin already exists",
            });
        }
        if (secretkey !== process.env.ADMIN_REGISTER_SECRET) {
            return res.status(409).json({
                message: "Invalid Admin Secret key",

            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword })
        await newAdmin.save()

        const token = jwt.sign(
            { id: newAdmin._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" },
        )
        res.cookie("Token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        const adminObj = newAdmin.toObject();
        delete adminObj.password
        res.status(201).json({
            message: "Register Sucessfull",
            data: adminObj
        });

    } catch (error) {
        res.status(500).json({
            message: "failed to Register Admin",
            error: error.message,
        });
    }

}

// login admin 
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        // otp 
        const otp = generateOtp()
        admin.otp = otp
        admin.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
        await admin.save();

        const emailResult = await sendVerificationEmail(admin.name, admin.email, otp);
        if (!emailResult.success) {
            return res.status(500).json({ message: "failed to send OTP email" });
        }


        res.status(200).json({ message: "OTP sent to your email" });


    } catch (error) {
        res.status(500).json({
            message: "failed to Login Admin",
            error: error.message,
        });
    }

}
// verify otp 
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }
        if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
            return res.status(401).json({
                message: "Invalid or expired OTP",
            });
        }
        // clear otp and expiry
        admin.otp = null;
        admin.otpExpiry = null;
        await admin.save();

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" },
        )
        res.cookie("Token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        const adminObj = admin.toObject();
        delete adminObj.password
        res.status(200).json({
            message: "Login Sucessfull",
            data: adminObj
        });

    } catch (error) {
        res.status(500).json({
            message: "failed to verify OTP",
            error: error.message,
        });
    }
}

//logout admin  
const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("Token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({
            message: "failed to Logout Admin",
            error: error.message,
        });
    }
}

module.exports = { registerAdmin, loginAdmin, verifyOtp, logoutAdmin };

