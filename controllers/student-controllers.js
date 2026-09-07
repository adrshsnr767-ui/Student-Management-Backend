const Student = require("../model/studentModel");
const bcrypt = require("bcrypt");
const Enrollment = require("../model/enrollment");

// add student
const addStudent = async (req, res) => {
    try {
        const { name, email, age, majorCourse } = req.body;
        // genetare a password for student
        const plainPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const verifyEmail = await Student.findOne({ email })
        if (verifyEmail) {
            return res.status(409).json({
                message: "student with this email already exists",

            });
        }
        const newStudent = new Student({ name, email, age, majorCourse, password: hashedPassword });
        await newStudent.save();

        const studentObj = newStudent.toObject();
        delete studentObj.password;
        res.status(201).json({
            message: "added sucessfully",
            data: studentObj,
            plainPassword
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// search student
const searchStudents = async (req, res) => {
    try {
        const { search, course } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { majorCourse: { $regex: search, $options: "i" } }
                ]
            };
        }
        if (course && course !== "All") {
            const enrolledStudentIds = await Enrollment.find({ course }).distinct("student");
            query._id = { $in: enrolledStudentIds };
        }
        const students = await Student.find(query)
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get all student
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// delete student by id
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ message: "student not found" });
        }
        await Enrollment.deleteMany({ student: id });
        res.status(200).json({ message: "student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// get stduent by id 
const studentByID = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "student not found" });
        }
        const enrollments = await Enrollment.find({ student: id }).populate("course");
        res.status(200).json({ message: "student found successfully", data: student, courses: enrollments, });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// update student by id
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age, majorCourse, status, semester, creditsCompleted, attendanceRate } = req.body;
        const student = await Student.findByIdAndUpdate(id, { name, email, age, majorCourse, status, semester, creditsCompleted, attendanceRate }, { new: true });
        if (!student) {
            return res.status(404).json({ message: "student not found" });
        }
        res.status(200).json({ message: "student updated successfully", data: student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addStudent,
    searchStudents,
    getAllStudents,
    deleteStudent,
    updateStudent,
    studentByID,
};
