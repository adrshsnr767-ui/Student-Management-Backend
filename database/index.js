const mongoose = require("mongoose");
const databaseConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("database connected");
    } catch (error) {
        console.log("database connection failed ", error);
        process.exit(1);
    }
};

module.exports = databaseConnection;    