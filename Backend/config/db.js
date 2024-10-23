const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://tropnicates:BQZ7PIxJHKdroqex@fullstack-blog-project.otgvrqz.mongodb.net/?retryWrites=true&w=majority');
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error", err);
    }
};

module.exports = connectDB;