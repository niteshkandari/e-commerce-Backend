import mongoose from "mongoose";
import process from "process";
import { DB_URL } from "../config";

export const databaseConnection = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URL);
    console.log("MongoDB database connection established successfully");
  } catch (err) {
    console.log("========== Error ============");
    console.log(err);
    console.log("========== Error ============");
    process.exit(1);
  }
};
