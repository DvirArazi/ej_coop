import type { Association, GameData, PerData, SttData } from "/@src/shared/types";

export interface ServerToClientEvents {
  identified: (name: string, associations: Association[]) => void;
  storytellerDataUpdated: (sttData: SttData) => void;
  personalityDataUpdated: (perData: PerData) => void;
}

export interface ClientToServerEvents {
  checkId: (
    id: string | null,
    callback: (idNew: string | null) => void
  ) => void;
  updateName: (name: string) => void;
  createRoom: (callback: (roomcode: string) => void) => void;
  doesRoomExist: (roomcode: string, callback: (roomExists: boolean) => void) => void;
  enterRoom: (roomcode: string, callback: (gameData: GameData | null) => void) => void;
  riskSet: (roomcode: string, risk: number | boolean) => void;
  vote: (roomcode: string, vote: boolean) => void;
  spin: (roomcode: string) => void;
  continue: (roomcode: string) => void;
  cancelSpin: (roomcode: string) => void;
}