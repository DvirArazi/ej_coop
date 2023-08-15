import type { Association, GameData, PersonalityData, StorytellerData } from "/@src/shared/types";

export interface ServerToClientEvents {
  identified: (name: string, associations: Association[]) => void;
  storytellerDataUpdated: (storytellerData: StorytellerData) => void;
  personalityDataUpdated: (personalityData: PersonalityData) => void;
}

export interface ClientToServerEvents {
  checkId: (
    id: string | undefined,
    callback: (idNew: string | undefined) => void
  ) => void;
  updateName: (name: string) => void;
  createRoom: (callback: (roomcode: string) => void) => void;
  doesRoomExist: (roomcode: string, callback: (roomExists: boolean) => void) => void;
  enterRoom: (roomcode: string, callback: (gameData: GameData | undefined) => void) => void;
}