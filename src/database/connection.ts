import mongoose from "mongoose";
import process from "process";
import { DB_URL } from "../config";

export const databaseConnection =  async () => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(DB_URL);
    console.log("DB connection established");
  } catch (err) {
    console.log('========== Error ============')
    console.log(err);
    console.log('========== Error ============')
    process.exit(1);
  }
}
