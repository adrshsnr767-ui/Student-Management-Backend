const express = require("express");
const courseController = require("../controllers/course-controller");
const { verifyToken } = require("../middleware/authmiddleware");

const courseRouter = express.Router();

courseRouter.route("/course").get(verifyToken, courseController.getAllCourses);

courseRouter.route("/course/add").post(verifyToken, courseController.addCourse);

courseRouter.route("/course/delete/:id").delete(verifyToken, courseController.deleteCourse);

courseRouter.route("/course/search/:search").get(verifyToken, courseController.searchCourses);

module.exports = courseRouter;