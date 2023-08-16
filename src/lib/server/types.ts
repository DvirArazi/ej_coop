import type { PhaseData } from "/@src/shared/types";

export type User = {
  id: string,
  socketId: string,
  name: string,
  rooms: Room[],
};

export type Room = {
  code: string,
  storyteller: User,
  personalities: User[],
  attemptsLeft: number,
  phaseData: PhaseData,
}