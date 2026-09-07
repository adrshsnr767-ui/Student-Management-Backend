const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true, trim: true }, 
    courseCode: { type: String, required: true, unique: true, trim: true }, 
    instructor: { type: String, required: true }, 
    credits: { type: Number, required: true },
    schedule: {
        days: { type: String, required: true },
        time: { type: String, required: true },   
    },
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;