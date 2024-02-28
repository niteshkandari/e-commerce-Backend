import dotEnv from "dotenv";

type variableType = {
  PORT: string | undefined;
  DB_URL: string | undefined;
};

if (process.env.NODE_ENV !== "prod") {
  dotEnv.config({override: true, path: '.env.dev'});
} else {
  dotEnv.config({override: true, path:".env.prod" });
}
export const environmentVariables: variableType = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  // APP_SECRET: process.env.APP_SECRET
};
