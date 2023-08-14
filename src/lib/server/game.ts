import type { Server } from "socket.io";
import type { Room, UserServer } from "src/lib/server/types";
import type { ClientToServerEvents, ServerToClientEvents } from "src/shared/socketIoTypes";

export class Game {
  private _users: UserServer[] = [];
  private _rooms: Room[] = [];

  createRoom(storyteller: UserServer): string {
    const roomcode = this.generateRoomcode();
    const room = {
      code: roomcode,
      storyteller: storyteller,
      personalities: [],
      attemptsLeft: 3,
    }

    this._rooms.push(room);
    storyteller.rooms.push(room);

    return "";
  }

  updateUserName(user: UserServer, nameNew: string) {
    user.name = nameNew;

    for (let room of user.rooms) {
      //continue from here
    }
  }

  addPersonality(room: Room,) {

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
}