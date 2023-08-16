export type Association = {
  roomcode: string,
  isStt: boolean
}

export type GameData = {
  isStt: true,
  sttData: SttData,
} | {
  isStt: false,
  perData: PerData,
}

export type SttData = {
  persNames: string[],
  attemptsLeft: number,
  phaseData: PhaseData,
}

export type PerData = {
  index: number,
  persNames: string[],
  attemptsLeft: number,
  phaseData: PhaseData,
}

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