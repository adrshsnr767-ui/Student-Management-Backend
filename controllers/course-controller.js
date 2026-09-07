const Course = require("../model/coursesModel");


// add course
const addCourse = async (req, res) => {
    try {
        const {
            courseName,
            courseCode,
            instructor,
            credits,
            schedule,
        } = req.body;

        const verifyCourseName = await Course.findOne({ courseName });

        if (verifyCourseName) {
            return res.status(409).json({
                message: "course already exists",
            });
        }

        const verifyCourseCode = await Course.findOne({ courseCode });

        if (verifyCourseCode) {
            return res.status(409).json({
                message: "course Code already Used",
            });
        }

        const newCourse = new Course({
            courseName,
            courseCode,
            instructor,
            credits,
            schedule,
        });

        await newCourse.save();

        res.status(201).json({
            message: "added successfully",
            data: newCourse,
        });
        console.log("REQ BODY:", req.body);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
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

const searchCourses = async (req, res) => {
    try {
        const { search } = req.params;
        const courses = await Course.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { courseCode: { $regex: search, $options: "i" } },
                { instructor: { $regex: search, $options: "i" } },
            ],
        });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const deleted = await Course.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "course not found" });
        }
        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addCourse, getAllCourses, searchCourses, deleteCourse };  
