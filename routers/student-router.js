const express = require("express");
const studentControllers = require("../controllers/student-controllers");
const { verifyToken } = require("../middleware/authmiddleware");

const studentRouter = express.Router();

studentRouter.route("/student").get(verifyToken, studentControllers.getAllStudents);

studentRouter.route("/student/add").post(verifyToken, studentControllers.addStudent);

studentRouter.route("/student/delete/:id").delete(verifyToken, studentControllers.deleteStudent);

studentRouter.route("/student/search").get(verifyToken, studentControllers.searchStudents);

studentRouter.route("/student/update/:id").put(verifyToken, studentControllers.updateStudent);

studentRouter.route("/student/:id").get(verifyToken, studentControllers.studentByID);

module.exports = studentRouter;