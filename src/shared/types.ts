export type Association = {
  roomcode: string,
  isStoryteller: boolean
}

export type GameData = {
  isStoryteller: true,
  storytellerData: SttData,
} | {
  isStoryteller: false,
  personalityData: PerData,
}

export type SttData = {
  persNames: string[],
  attemptsLeft: number,
  phaseData: PhaseData,
}

export type PerData = {
  index: number,
  personalitiesNames: string[],
  attemptsLeft: number,
  phaseData: PhaseData,
}

export enum Phase {
  Start,
  SetRisk,
  Vote,
  Spin,
}

export type PhaseData = {
  phase: Phase.Start,
} | {
  phase: Phase.SetRisk,
} | {
  phase: Phase.Vote,
  risk: number,
  votesFor: (boolean | undefined)[],
  timeLeft: number,
} | {
  phase: Phase.Spin,
  velocity: number,
}