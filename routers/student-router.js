const express = require("express");
const studentControllers = require("../controllers/student-controllers");
const { verifyToken } = require("../middleware/authmiddleware");

const studentRouter = express.Router();

studentRouter.route("/student").get(verifyToken, studentControllers.getAllStudents);

studentRouter.route("/student/add").post(verifyToken, studentControllers.addStudent);

studentRouter.route("/student/delete/:id").delete(verifyToken, studentControllers.deleteStudent);

studentRouter.route("/student/login").post(studentControllers.loginStudent);

studentRouter.route("/student/logout").post(studentControllers.logoutStudent);

studentRouter.route("/student/reset-password/:id").post(studentControllers.resetPassword);

studentRouter.route("/student/update/:id").put(verifyToken, studentControllers.updateStudent);

studentRouter.route("/student/:id").get(verifyToken, studentControllers.studentByID);

studentRouter.route("/student/search").get(verifyToken, studentControllers.searchStudents);
module.exports = studentRouter;