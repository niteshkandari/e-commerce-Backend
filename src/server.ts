import http from "http";
import express from "express";
import expressApp from "./app";
import { PORT } from "./config";
import { databaseConnection } from "./database/connection";

const app = express();
const server = http.createServer(app);

const startServer = async () => {
  await databaseConnection();

  await expressApp(app);

  server.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
  });
};

startServer();
