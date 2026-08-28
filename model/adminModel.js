const mongoose = require("mongoose");

// schema for admin
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    secretkey: { type: String, required: true },

    // for login OTP 
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
}, { timestamps: true }
)

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;