import type { Server } from "socket.io";
import type { EventNames, EventParams, EventsMap } from "socket.io/dist/typed-events";
import type { Room, User } from "/@src/lib/server/types";
import type { ClientToServerEvents, ServerToClientEvents } from "/@src/shared/socketIoTypes";
import { Phase, type GameData } from "/@src/shared/types";
import { v4 as uuidv4 } from 'uuid';
import { DIE_RESOLUTION, VOTE_SECONDS } from "/@src/shared/constants";

export class Game {
  private _io: Server<ClientToServerEvents, ServerToClientEvents>;
  private _users: User[] = [];
  private _rooms: Room[] = [];

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    this._io = io;
  }

  findUserById(id: String): User | null {
    const value = this._users.find(user => user.id === id);
    return value !== undefined ? value : null;
  }

  findUserBySocketId(socketId: String): User | null {
    const value = this._users.find(user => user.socketId === socketId);
    return value !== undefined ? value : null;
  }

  findRoomByRoomcode(roomcode: string): Room | null {
    const value = this._rooms.find(room => room.code === roomcode);
    return value !== undefined ? value : null;
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
      this.emitGameDataUpdated(room);
    }
  }

  createRoom(storyteller: User): string {
    const roomcode = this.generateRoomcode();
    const room: Room = {
      code: roomcode,
      stt: storyteller,
      pers: [],
      attemptsLeft: 3,
      phaseData: { phase: Phase.Start }
    }

    this._rooms.push(room);
    storyteller.rooms.push(room);

    return roomcode;
  }

  addPersonality(room: Room, user: User) {
    room.pers.push(user);
    user.rooms.push(room);

    this.emitGameDataUpdated(room);
  }

  // getGameData(room: Room, user: User): GameData {
  //   const personalitiesNames = room.personalities.map(per => per.name);

  //   return room.storyteller === user ?
  //     {
  //       isStoryteller: true,
  //       storytellerData: {
  //         persNames: personalitiesNames,
  //         attemptsLeft: room.attemptsLeft,
  //         phaseData: room.phaseData,
  //       }
  //     } :
  //     {
  //       isStoryteller: false,
  //       personalityData: {
  //         index: user.name,
  //         personalitiesNames: personalitiesNames,
  //         attemptsLeft: room.attemptsLeft,
  //       }
  //     }
  // }

  setVotePhase(room: Room, risk: number): void {
    room.phaseData = {
      phase: Phase.Vote,
      risk: risk,
      secondsToVote: VOTE_SECONDS,
      votesFor: [
        ...[true],
        ...(new Array(room.pers.length - 1).fill(null))
      ]
    }

    this.emitGameDataUpdated(room);
  }

  private generateRoomcode(): string {
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

  private emitGameDataUpdated(room: Room): void {
    const persNames = room.pers.map(per => per.name);

    this._io.to(room.stt.socketId).emit("storytellerDataUpdated", {
      roomcode: room.code,
      persNames: persNames,
      attemptsLeft: room.attemptsLeft,
      phaseData: room.phaseData,
    });
    room.pers.forEach((per, i) => {
      this._io.to(per.socketId).emit("personalityDataUpdated", {
        roomcode: room.code,
        index: i,
        persNames: persNames,
        attemptsLeft: room.attemptsLeft,
        phaseData: room.phaseData,
      });
    });
  }

  // private emitToRoom<EmitEvents extends EventsMap, Ev extends EventNames<ServerToClientEvents>>(room: Room, ev: Ev, ...args: EventParams<EmitEvents, Ev>) {
  //   this._io.to(room.storyteller.id).emit(ev, ...args);
  //   for (const per of room.personalities) {
  //     this._io.to(per.id).emit(ev, ...args);
  //   }
  // }
}