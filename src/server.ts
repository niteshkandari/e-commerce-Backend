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

startServer();