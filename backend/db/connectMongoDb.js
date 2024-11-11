import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongoDb = async () => {
  try {
    console.log(process.env.MONGO_DB_URI);
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

export default connectMongoDb;
