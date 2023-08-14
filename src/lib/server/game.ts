import type { Server } from "socket.io";
import type { EventNames, EventParams, EventsMap } from "socket.io/dist/typed-events";
import type { Room, User } from "src/lib/server/types";
import type { ClientToServerEvents, ServerToClientEvents } from "src/shared/socketIoTypes";
import type { GameData } from "src/shared/types";
import { v4 as uuidv4 } from 'uuid';

export class Game {
  private _io: Server<ClientToServerEvents, ServerToClientEvents>;
  private _users: User[] = [];
  private _rooms: Room[] = [];

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    this._io = io;
  }

  findUserById(id: String): User | undefined {
    return this._users.find(user => user.id == id);
  }

  findUserBySocketId(socketId: String): User | undefined {
    return this._users.find(user => user.socketId == socketId);
  }

  findRoomByRoomcode(roomcode: string) {
    return this._rooms.find(room => room.code == roomcode);
  }

  addUser(socketId: string): User {
    const user = {
      id: uuidv4(),
      socketId: socketId,
      name: "",
      rooms: []
    };

    this._users.push(user);

    return user;
  }

  updateUserName(user: User, nameNew: string) {
    user.name = nameNew;

    for (let room of user.rooms) {
      let gameData = this.getGameData(room, user);

      this.emitGameDataUpdate(room, gameData);
    }
  }

  createRoom(storyteller: User): string {
    const roomcode = this.generateRoomcode();
    const room = {
      code: roomcode,
      storyteller: storyteller,
      personalities: [],
      attemptsLeft: 3,
    }

    this._rooms.push(room);
    storyteller.rooms.push(room);

    return roomcode;
  }

  addPersonality(room: Room, user: User) {
    room.personalities.push(user);
    user.rooms.push(room);

    const gameData = this.getGameData(room, user);

    this.emitGameDataUpdate(room, gameData);
  }

  getGameData(room: Room, user: User): GameData {
    return {
      role: room.storyteller == user ? "storyteller" : "personality",
      persNames: room.personalities.map(per => per.name),
      attemptsLeft: room.attemptsLeft
    }
  }

  private generateRoomcode() {
    const aCode = "A".charCodeAt(0);
    const zCode = "Z".charCodeAt(0);

    let roomcode = "";
    do {
      for (let i = 0; i < 4; i++) {
        roomcode += String.fromCharCode(
          aCode + Math.floor(Math.random() * (zCode - aCode + 1))
        );
      }
    } while (this._rooms.map(room => room.code).includes(roomcode));

    return roomcode;
  }

  private emitGameDataUpdate(room: Room, gameData: GameData) {
    this._io.to(room.storyteller.id).emit("gameDataUpdated", gameData);
    for (const per of room.personalities) {
      this._io.to(per.id).emit("gameDataUpdated", gameData);
    }
  }

  // private emitToRoom<EmitEvents extends EventsMap, Ev extends EventNames<ServerToClientEvents>>(room: Room, ev: Ev, ...args: EventParams<EmitEvents, Ev>) {
  //   this._io.to(room.storyteller.id).emit(ev, ...args);
  //   for (const per of room.personalities) {
  //     this._io.to(per.id).emit(ev, ...args);
  //   }
  // }
}