import type { Server } from "socket.io";
import type { Game } from "src/lib/server/game";
import type { ClientToServerEvents, ServerToClientEvents } from "src/shared/socketIoTypes";

export class client {
  private _socket: Server<ClientToServerEvents, ServerToClientEvents>;
  private _game: Game;

  constructor(
    socket: Server<ClientToServerEvents, ServerToClientEvents>,
    game: Game
  ) {
    this._socket = socket;
    this._game = game;
  }


}