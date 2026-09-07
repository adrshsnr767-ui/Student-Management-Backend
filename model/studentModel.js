const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    // student schema for admin page
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    majorCourse: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },


    // student schema for individual student dashboard
    studentId: {
        type: String,
        unique: true,
        default: () => `STU-${Math.floor(1000 + Math.random() * 9000)}`
    },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    semester: { type: String, default: '1st Semester' },
    creditsCompleted: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 100 },
}, { timestamps: true }

);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;