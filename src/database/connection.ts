import mongoose from "mongoose";
import { environmentVariables } from "../config";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of 65aaa71 (added controllers)
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
<<<<<<< HEAD
}
=======
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
>>>>>>> 4d3dfd45cbfe172eca91947e63101892ea4c57f7
=======
}
>>>>>>> parent of 65aaa71 (added controllers)
