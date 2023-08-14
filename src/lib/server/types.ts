export type User = {
  id: string,
  socketId: string,
  name: string,
  rooms: Room[],
};

export type Room = {
  code: string,
  storyteller: User,
  personalities: User[],
  attemptsLeft: number,
}