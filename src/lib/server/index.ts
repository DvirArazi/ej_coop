import express from "express";
import { createServer } from "http";
import initSocketIoServer from "/@src/lib/server/socketIoServer";
import {handler} from '../../../build/handler';
import { server } from "../../../build";

const port = process.env.PORT !== undefined ? process.env.PORT : "3000";
const app = express();
const httpServer = createServer(app);

initSocketIoServer(httpServer);

app.use(handler);
server.listen(port);