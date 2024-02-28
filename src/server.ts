<<<<<<< HEAD
import http from "http";
import app from "./app";
import { environmentVariables } from "./config";
import { databaseConnection } from "./database/connection";

const { PORT } = environmentVariables;
const server = http.createServer(app);

const startServer = async () => {
    await databaseConnection();
    server.listen(PORT, () => {
        console.log(`server started on ${PORT}`);
    })
}

<<<<<<< HEAD
startServer();
=======
import express from "express";
import expressApp from "./app";
import { PORT } from "./config";
import prisma from "./prismaClient";

const app = express();

const startServer = async () => {
  await prisma.$connect();
  await expressApp(app);
  app.listen(PORT, () => {
    console.log("Db connection established");
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
>>>>>>> 4d3dfd45cbfe172eca91947e63101892ea4c57f7
=======
startServer();
>>>>>>> parent of 65aaa71 (added controllers)
