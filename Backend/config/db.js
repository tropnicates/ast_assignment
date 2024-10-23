const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // await mongoose.connect("mongodb://127.0.0.1:27017/ruleEngine");
        await mongoose.connect('mongodb+srv://kiran18202:6zoA6gNT2Un7VwZj@ruleengine.rvs8z.mongodb.net/ruleEngine');
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error", err);
    }
};

module.exports = connectDB;