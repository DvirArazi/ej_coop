import type { Server } from "socket.io";
import type { EventNames, EventParams, EventsMap } from "socket.io/dist/typed-events";
import type { Room, User } from "/@src/lib/server/types";
import type { ClientToServerEvents, ServerToClientEvents } from "/@src/shared/socketIoTypes";
import { Phase, type GameData } from "/@src/shared/types";
import { v4 as uuidv4 } from 'uuid';
import { DIE_RESOLUTION, VOTE_SECONDS } from "/@src/shared/constants";
import { findIndexN, genRand, getIsSuccess } from "/@src/shared/funcs";

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

  setVotePhase(room: Room, user: User, risk: number | boolean): void {
    if (
      room.stt !== user ||
      room.phaseData.phase !== Phase.Start ||
      (typeof risk !== "boolean" && (risk < 0 || risk > 1))
    ) return;

    room.phaseData = {
      phase: Phase.Vote,
      risk: risk,
      secondsToVote: VOTE_SECONDS,
      votes: [
        ...[true],
        ...(new Array(room.pers.length - 1).fill(null))
      ],
      revolutionsC: 0,
    }

    if (typeof risk !== "boolean") {
      const intervalId = setInterval(() => {
        if (
          room.phaseData.phase !== Phase.Vote ||
          room.phaseData.secondsToVote <= 0 ||
          room.phaseData.revolutionsC > 0
        ) {
          clearInterval(intervalId);
          return;
        }

        room.phaseData.secondsToVote -= 1;

        this.emitGameDataUpdated(room);
      }, 1000);
    }

    this.emitGameDataUpdated(room);
  }

  vote(room: Room, user: User, vote: boolean): void {
    if (
      room.phaseData.phase != Phase.Vote ||
      room.phaseData.secondsToVote <= 0
    ) return;
    const userI = findIndexN(room.pers, per => per === user);
    if (userI === null) return;

    room.phaseData.votes[userI] = vote;

    if (!room.phaseData.votes.includes(null)) {
      room.phaseData.secondsToVote = 0;
    }

    this.emitGameDataUpdated(room);
  }

  spin(room: Room, user: User) {
    if (
      room.phaseData.phase !== Phase.Vote ||
      room.phaseData.secondsToVote > 0 ||
      room.pers[0] !== user
    ) return;

    room.phaseData.revolutionsC = genRand(5, 15);

    this.emitGameDataUpdated(room);
  }

  continueGame(room: Room, user: User) {
    if (
      room.stt !== user ||
      room.phaseData.phase != Phase.Vote
    ) return;

    const isSuccess =
      typeof room.phaseData.risk === "boolean" ?
        room.phaseData.risk :
        getIsSuccess(
          room.phaseData.revolutionsC,
          room.phaseData.risk,
          room.phaseData.votes,
        );

    if (isSuccess && room.attemptsLeft > 1) room.attemptsLeft -= 1;
    else {
      room.pers.unshift(room.pers.pop()!);
      room.attemptsLeft = 3;
    }

    room.phaseData = { phase: Phase.Start };

    this.emitGameDataUpdated(room);
  }

  cancelSpin(room: Room, user: User) {
    if (
      room.stt !== user ||
      room.phaseData.phase !== Phase.Vote
    ) return;

    room.phaseData = { phase: Phase.Start };

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