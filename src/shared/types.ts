export type Association = {
  roomcode: string,
  isStt: boolean
}

export type UserData = {
  name: string,
  associations: Association[],
}

export type RoleData = {
  roomcode: string,
  persNames: string[],
  attemptsLeft: number,
  phaseData: PhaseData,
}

export type SttData = RoleData;

export type PerData = RoleData & {
  index: number,
}

export type GameData = {
  isStt: true,
  sttData: SttData,
} | {
  isStt: false,
  perData: PerData,
};

export enum Phase {
  Start,
  Vote,
}

export type PhaseData = {
  phase: Phase.Start,
} | {
  phase: Phase.Vote,
  risk: number | boolean,
  votes: (boolean | null)[],
  secondsToVote: number,
  revolutionsC: number,
}