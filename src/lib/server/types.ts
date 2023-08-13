import type { User } from "src/shared/types";

export type UserServer = {
  cookieId: string,
  socketId: string,
} & User;

export type Room = {
  code: string,
  storytellerId: string,
  personalitiesIds: string[],
  attemptsLeft: number,
}