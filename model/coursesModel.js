const mongoose = require("mongoose");

// schema for individual courses listed in student page
const courseSchema = new mongoose.Schema({
    courseCode: { type: String, default: "CS101", unique: true },
    title: { type: String, required: true },
    instructor: { type: String, default: "TBD" },
    credits: { type: Number, default: 3 },
    schedule: { type: String, default: 'TBD' },
    grade: { type: String, default: 'N/A' },
    gradePoint: { type: Number, default: 0.0 }
});
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;