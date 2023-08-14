import type { GameData, User } from "src/shared/types";

export interface ServerToClientEvents {
  identified: (user: User) => void;
  gameDataUpdated: (gameData: GameData) => void;
}

export interface ClientToServerEvents {
  checkId: (
    cookieId: string | undefined,
    callback: (cookieIdNew: string | undefined) => void
  ) => void;
  updateName: (name: string) => void;
  createRoom: (callback: (roomcode: string) => void) => void;
  doesRoomExist: (roomcode: string, callback: (roomExists: boolean) => void) => void;
  enterRoom: (roomcode: string, callback: (gameData: GameData | undefined) => void) => void;
}