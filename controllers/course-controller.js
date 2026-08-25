const Course = require("../model/coursesModel");


// add course
const addCourse = async (req, res) => {
    try {
        const { courseCode, title, instructor, credits, schedule, grade, gradePoint } = req.body;
        const verifyCourseTitle = await Course.findOne({ title });
        if (verifyCourseTitle) {
            return res.status(409).json({
                message: "course already exists",

            });
        }
        const verifyCourseCode = await Course.findOne({ courseCode });
        if (verifyCourseCode) {
            return res.status(409).json({
                message: "course Code  already Used",

            });
        }
        const newCourse = new Course({ courseCode, title, instructor, credits, schedule, grade, gradePoint })
        await newCourse.save();
        res.status(201).json({
            message: "added sucessfully",
            data: newCourse
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// get all course
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 
module.exports = { addCourse, getAllCourses };    
