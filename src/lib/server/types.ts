import type { PhaseData } from "/@src/shared/types";

export type User = {
  id: string,
  socketId: string,
  name: string,
  rooms: Room[],
};

export type Room = {
  code: string,
  stt: User,
  pers: User[],
  attemptsLeft: number,
  phaseData: PhaseData,
}