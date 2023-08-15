export type Association = {
  roomcode: string,
  isStoryteller: boolean
}

export type GameData =
  {
    isStoryteller: true,
    storytellerData: StorytellerData,
  } |
  {
    isStoryteller: false,
    personalityData: PersonalityData,
  }

export type StorytellerData = {
  personalitiesNames: string[],
  attemptsLeft: number,
}

export type PersonalityData = {
  name: string,
  personalitiesNames: string[],
  attemptsLeft: number,
}