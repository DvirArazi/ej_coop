import { ViteDevServer } from "vite";

import type http from 'http';
import initSocketIoServer from "./src/lib/server/socketIoServer";

export function bla(server: ViteDevServer) {
  initSocketIoServer(server.httpServer as http.Server);
}