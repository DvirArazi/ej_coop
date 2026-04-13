import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { handler } from "./build/handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadSocketServerInit() {
  const chunksDir = path.join(__dirname, "build", "server", "chunks");
  const hooksChunk = fs.readdirSync(chunksDir).find((file) => /^hooks\.server-.*\.js$/.test(file));

  if (hooksChunk === undefined) {
    throw new Error("Could not locate compiled hooks.server chunk in build/server/chunks");
  }

  const hooksModule = await import(pathToFileURL(path.join(chunksDir, hooksChunk)).href);
  if (typeof hooksModule.initSocketIoServer !== "function") {
    throw new Error("Compiled hooks.server chunk does not export initSocketIoServer");
  }

  return hooksModule.initSocketIoServer;
}

const initSocketIoServer = await loadSocketServerInit();

const socketPath = process.env.SOCKET_PATH;
const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 3000);

const server = http.createServer();

initSocketIoServer(server);
server.on("request", handler);

server.listen(socketPath ? { path: socketPath } : { host, port }, () => {
  console.log(`Listening on ${socketPath ?? `${host}:${port}`}`);
});
