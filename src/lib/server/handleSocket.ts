import type { Socket } from "socket.io";
import type { Game } from "/@src/lib/server/game";
import type { ClientToServerEvents, ServerToClientEvents } from "/@src/shared/socketIoTypes";
import type { User } from "/@src/lib/server/types";
import { Phase, type GameData } from "/@src/shared/types";
import { findIndexN } from "/@src/shared/funcs";

export function handleSocket(
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  game: Game
) {

  //=========
  // checkId
  //=========
  socket.on("checkId", (id, callback) => {
    let user: User | null;
    if (id === null || (user = game.findUserById(id)) === null) {
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
          isStt: room.stt === user
        }
      })
    );
  });

  //============
  // updateName
  //============
  socket.on("updateName", name => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;

    game.updateUserName(user, name);
  });

  //============
  // createRoom
  //============
  socket.on("createRoom", callback => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;

    const roomcode = game.createRoom(user);

    callback(roomcode);
  });

  //===========
  // enterRoom
  //===========
  socket.on("enterRoom", (roomcode, callback) => {
    function inner(): GameData | null {
      const user = game.findUserBySocketId(socket.id);
      if (user === null) return null;
      const room = game.findRoomByRoomcode(roomcode);
      if (room === null) return null;

      let isStt = room.stt === user;

      if (!isStt && !room.pers.includes(user)) {
        game.addPersonality(room, user);
      }

      const persNames = room.pers.map(per => per.name);

      if (isStt) {
        return {
          isStt: true,
          sttData: {
            roomcode: roomcode,
            persNames: persNames,
            attemptsLeft: room.attemptsLeft,
            phaseData: room.phaseData,
          }
        };
      } else {
        return {
          isStt: false,
          perData: {
            index: findIndexN(room.pers, per => per === user)!,
            roomcode: roomcode,
            persNames: persNames,
            attemptsLeft: room.attemptsLeft,
            phaseData: room.phaseData,
          }
        };
      }
    }

    callback(inner());
  });

  //===============
  // doesRoomExist
  //===============
  socket.on("doesRoomExist", (roomcode, callback) => {
    callback(game.findRoomByRoomcode(roomcode) !== null);
  });

  //=========
  // riskSet
  //=========
  socket.on("riskSet", (roomcode, risk) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;
    const room = game.findRoomByRoomcode(roomcode);
    if (room === null) return;
    if (
      room.stt !== user ||
      room.phaseData.phase !== Phase.Start ||
      risk < 0 || risk > 1
    ) return;

    game.setVotePhase(room, risk);
  });

  //============
  // disconnect
  //============
  socket.on("disconnect", () => {

  });
}