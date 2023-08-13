export type User = {
  name: string,
  roles: Association[],
}

export type Association = {
  roomcode: string,
  role: Role
}

export type Role = "storyteller" | "personality";

export type GameData = {
  role: Role,
  persNames: string[],
  attemptsLeft: number,
}