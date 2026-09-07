const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    grade: { type: String, default: "N/A" }, 
    semester: { type: String, required: true },
}, { timestamps: true });

// prevents duplicate enrollment of same course by same student
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;