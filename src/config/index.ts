import dotEnv from "dotenv";

declare const process : {
  env: {
    NODE_ENV: string,
    PORT: string,
    MONGODB_URI: string,
    APP_SECRET: string
  }
}

if (process.env.NODE_ENV !== "prod") {
  dotEnv.config({ override: true, path: ".env.dev" });
} else {
  dotEnv.config({ override: true, path: ".env.prod" });
}

const { PORT, MONGODB_URI: DB_URL, APP_SECRET } = process.env;

export { PORT, DB_URL, APP_SECRET };
