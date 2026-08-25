const express = require("express")
const adminController = require("../controllers/admin-controller");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../schemas/userSchema");
const adminRouter = express.Router();

adminRouter.route("/admin/register").post(validate(registerSchema), adminController.registerAdmin);

adminRouter.route("/admin/login").post(validate(loginSchema), adminController.loginAdmin);

adminRouter.route("/admin/verify-otp").post(adminController.verifyOtp);

adminRouter.route("/admin/logout").post(adminController.logoutAdmin);

module.exports = adminRouter