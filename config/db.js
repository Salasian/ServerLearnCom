const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://db_user:dbuser@learnstorage.n7u5npy.mongodb.net/learnStorage";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`DB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
