import mongoose from "mongoose";
import { environmentVariables } from "../config";

console.log(environmentVariables);
const { DB_URL } = environmentVariables;
export const databaseConnection =  async () => {
  try {
    await mongoose.connect(DB_URL as string);
    console.log("DB connection established");
  } catch (err) {
    console.log('Error ============')
    console.log(err);
    process.exit(1);
  }
}