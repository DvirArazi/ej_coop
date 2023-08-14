import type { User } from "src/shared/types";

export type UserServer = {
  cookieId: string,
  socketId: string,
  name: string,
  rooms: Room[],
};

export type Room = {
  code: string,
  storyteller: UserServer,
  personalities: UserServer[],
  attemptsLeft: number,
}