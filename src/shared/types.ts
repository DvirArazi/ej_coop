export type Association = {
  roomcode: string,
  isStt: boolean
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
  Spin,
}

export type PhaseData = {
  phase: Phase.Start,
} | {
  phase: Phase.Vote,
  risk: number,
  votesFor: (boolean | undefined)[],
  timeLeft: number,
} | {
  phase: Phase.Spin,
  velocity: number,
}