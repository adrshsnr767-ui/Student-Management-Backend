const mongoose = require("mongoose");
// student schema
const studentSchema = new mongoose.Schema({
    // student shcema for admin page 
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    majorCourse: { type: String, required: true },
    password: { type: String, required: true },


    // student schema for student dashboard
    studentId: {
        type: String,
        unique: true,
        default: () => `STU-${Math.floor(1000 + Math.random() * 9000)}`
    },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    semester: { type: String, default: '1st Semester' },
    creditsCompleted: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 100 },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
}, { timestamps: true }// adds created att and updated atu

)
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

