const express = require("express")
const adminController = require("../controllers/admin-controller");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../schemas/userSchema");
const { verifyToken } = require("../middleware/authmiddleware");
const adminRouter = express.Router();

adminRouter.route("/admin/register").post(validate(registerSchema), adminController.registerAdmin);

adminRouter.route("/admin/login").post(validate(loginSchema), adminController.loginAdmin);

adminRouter.route("/admin/verify-otp").post(adminController.verifyOtp);

adminRouter.route("/admin/logout").post(adminController.logoutAdmin);

adminRouter.route("/admin/me").get(verifyToken, adminController.me);

module.exports = adminRouter