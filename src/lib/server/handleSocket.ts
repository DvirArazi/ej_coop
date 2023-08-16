import type { Socket } from "socket.io";
import type { Game } from "/@src/lib/server/game";
import type { ClientToServerEvents, ServerToClientEvents } from "/@src/shared/socketIoTypes";
import type { User } from "/@src/lib/server/types";
import { DIE_RESOLUTION } from "/@src/shared/constants";
import { Phase, type GameData } from "/@src/shared/types";

export function handleSocket(
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  game: Game
) {

  //=========
  // checkId
  //=========
  socket.on("checkId", (id, callback) => {
    let user: User | undefined;
    if (id === undefined || (user = game.findUserById(id)) === undefined) {
      user = game.addUser(socket.id);
    }
    else {
      user.socketId = socket.id;
    }

    callback(user.id);

    socket.emit("identified",
      user.name,
      user.rooms.map(room => {
        return {
          roomcode: room.code,
          isStoryteller: room.storyteller === user
        }
      })
    );
  });

  //============
  // updateName
  //============
  socket.on("updateName", name => {
    const user = game.findUserBySocketId(socket.id);
    if (user === undefined) return;

    game.updateUserName(user, name);
  });

  //============
  // createRoom
  //============
  socket.on("createRoom", callback => {
    const user = game.findUserBySocketId(socket.id);
    if (user === undefined) return;

    const roomcode = game.createRoom(user);

    callback(roomcode);
  });

  //===========
  // enterRoom
  //===========
  socket.on("enterRoom", (roomcode, callback) => {
    function inner(): GameData | undefined {
      const user = game.findUserBySocketId(socket.id);
      if (user === undefined) return undefined;
      const room = game.findRoomByRoomcode(roomcode);
      if (room === undefined) return undefined;

      let isStoryteller: boolean;
      if (room.storyteller === user) {
        isStoryteller = true;
      }
      else if (room.personalities.includes(user)) {
        isStoryteller = false;
      } else {
        isStoryteller = false;
        game.addPersonality(room, user);
      }

      //game.getGameData(room, user);
      return room.storyteller === user ?
      {
        isStoryteller: true,
        storytellerData: {
          persNames: personalitiesNames,
          attemptsLeft: room.attemptsLeft,
          phaseData: room.phaseData,
        }
      } :
      {
        isStoryteller: false,
        personalityData: {
          index: user.name,
          personalitiesNames: personalitiesNames,
          attemptsLeft: room.attemptsLeft,
          phaseData: room.phaseData
        }
      }
    }
    
    callback(inner());
  });

  //===============
  // doesRoomExist
  //===============
  socket.on("doesRoomExist", (roomcode, callback) => {
    callback(game.findRoomByRoomcode(roomcode) !== undefined);
  });

  //=========
  // riskSet
  //=========
  socket.on("riskSet", (roomcode, risk) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === undefined) return;
    const room = game.findRoomByRoomcode(roomcode);
    if (room === undefined) return;
    if (
      room.storyteller !== user ||
      room.phaseData.phase !== Phase.SetRisk ||
      risk < 0 || risk > 1
    ) return;


  });

  //============
  // disconnect
  //============
  socket.on("disconnect", () => {

  });
}