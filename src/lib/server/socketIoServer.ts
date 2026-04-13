import type * as http from "http";
import { Server } from "socket.io";
import { Game } from "/@src/lib/server/game";
import type { ClientToServerEvents, ServerToClientEvents } from "/@src/shared/socketIoTypes";
import { handleSocket } from "/@src/lib/server/handleSocket";

type GlobalSocketState = typeof globalThis & {
  __ejCoopIo__?: Server<ClientToServerEvents, ServerToClientEvents>;
};

export function initSocketIoServer(httpServer: http.Server) {
  const globalState = globalThis as GlobalSocketState;
  if (globalState.__ejCoopIo__ !== undefined) return globalState.__ejCoopIo__;

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });
  const game = new Game(io);

  io.on("connection", (socket) => handleSocket(socket, game));

  globalState.__ejCoopIo__ = io;

  return io;
}

export default initSocketIoServer;
