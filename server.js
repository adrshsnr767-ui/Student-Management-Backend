require("dotenv").config();
const express = require("express");
const databaseConnection = require("./database");
const studentRouter = require("./routers/student-router");
const cors = require("cors");
const courseRouter = require("./routers/course-router");
const adminRouter = require("./routers/admin-router");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// student 
app.use("/", studentRouter);
// courses
app.use("/", courseRouter)
// admin
app.use("/", adminRouter)

databaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`server statring at ${PORT}`);
  });
});
