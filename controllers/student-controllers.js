const Student = require("../model/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            query.enrolledCourses = course;
        }
        const students = await Student.find(query).populate("enrolledCourses", "title");
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get all student
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate("enrolledCourses", "title");
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
        res.status(200).json({ message: "student found successfully", data: student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// update student by id
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age, majorCourse, status, semester, creditsCompleted, attendanceRate, enrolledCourses } = req.body;
        const student = await Student.findByIdAndUpdate(id, { name, email, age, majorCourse, status, semester, creditsCompleted, attendanceRate, enrolledCourses }, { new: true });
        if (!student) {
            return res.status(404).json({ message: "student not found" });
        }
        res.status(200).json({ message: "student updated successfully", data: student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//login student
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({
                message: "student not found",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({
            message: "failed to Login Student",
            error: error.message,
        });
    }

}
// logout student
const logoutStudent = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).send({
            message: "failed to Logout Student",
            error: error.message,
        });
    }
};
// reset student password 
const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const newPlainPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPlainPassword, 10);
        const student = await Student.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        if (!student) return res.status(404).json({ message: "student not found" });
        res.status(200).json({ message: "password reset successfully", newPlainPassword });
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
    loginStudent,
    logoutStudent,
    resetPassword
};
