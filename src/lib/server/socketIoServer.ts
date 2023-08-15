import type * as http from "http";
import { Server } from "socket.io";
import { Game } from "src/lib/server/game";
// import { handleSocket } from "src/lib/server/handleSocket";
import type { ClientToServerEvents, ServerToClientEvents } from "src/shared/socketIoTypes";

export default function initSocketIoServer(httpServer: http.Server) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
  // const game = new Game(io);

  // io.on("connection", (socket) => handleSocket(socket, game));
}