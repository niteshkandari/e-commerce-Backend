import dotEnv from "dotenv";

<<<<<<< HEAD
type variableType = {
  PORT: string | undefined;
  DB_URL: string | undefined;
};

if (process.env.NODE_ENV !== "prod") {
  dotEnv.config({override: true, path: '.env.dev'});
=======
declare const process : {
  env: {
    NODE_ENV: string,
    PORT: string,
    DATABASE_URL: string,
    APP_SECRET: string
  }
}

if (process.env.NODE_ENV !== "prod") {
  dotEnv.config({ override: true, path: ".env" });
>>>>>>> 4d3dfd45cbfe172eca91947e63101892ea4c57f7
} else {
  dotEnv.config({override: true, path:".env.prod" });
}
<<<<<<< HEAD
export const environmentVariables: variableType = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  // APP_SECRET: process.env.APP_SECRET
};
=======

const { PORT, DATABASE_URL, APP_SECRET } = process.env;

export { PORT, DATABASE_URL, APP_SECRET };
>>>>>>> 4d3dfd45cbfe172eca91947e63101892ea4c57f7
