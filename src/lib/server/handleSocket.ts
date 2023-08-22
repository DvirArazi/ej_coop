import type { Socket } from "socket.io";
import type { Game } from "/@src/lib/server/game";
import type { ClientToServerEvents, ServerToClientEvents } from "/@src/shared/socketIoTypes";
import type { User } from "/@src/lib/server/types";
import { findIndexN } from "/@src/shared/funcs";
import type { GameData, RoleData } from "/@src/shared/types";

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
  });

  //=============
  // getUserData
  //=============
  socket.on("getUserData", (callback) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;

    callback({
      name: user.name,
      associations: user.rooms.map(room => {
        return {
          roomcode: room.code,
          isStt: room.stt === user
        }
      })
    });
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

      const roleData: RoleData = {
        roomcode: roomcode,
        persNames: persNames,
        attemptsLeft: room.attemptsLeft,
        phaseData: room.phaseData,
      }

      if (isStt) {
        return {
          isStt: true,
          sttData: roleData
        };
      } else {
        return {
          isStt: false,
          perData: {
            ...{ index: findIndexN(room.pers, per => per === user)! },
            ...roleData,
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

    game.setVotePhase(room, user, risk);
  });

  //======
  // vote
  //======
  socket.on("vote", (roomcode, vote) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;
    const room = game.findRoomByRoomcode(roomcode);
    if (room === null) return;

    game.vote(room, user, vote);
  });

  //======
  // spin
  //======
  socket.on("spin", (roomcode) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;
    const room = game.findRoomByRoomcode(roomcode);
    if (room === null) return;

    game.spin(room, user);
  });

  //==========
  // continue
  //==========
  socket.on("continue", (roomcode) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;
    const room = game.findRoomByRoomcode(roomcode);
    if (room === null) return;

    game.continueGame(room, user);
  });

  //============
  // cancelSpin
  //============
  socket.on("cancelSpin", (roomcode) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;
    const room = game.findRoomByRoomcode(roomcode);
    if (room === null) return;

    game.cancelSpin(room, user);
  });

  //============
  // deleteRoom
  //============
  socket.on("deleteRoom", (roomcode) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;
    const room = game.findRoomByRoomcode(roomcode);
    if (room === null) return;

    game.deleteRoom(room, user);
  });

  //===========
  // removePer
  //===========
  socket.on("removePer", (roomcode, perI) => {
    const user = game.findUserBySocketId(socket.id);
    if (user === null) return;
    const room = game.findRoomByRoomcode(roomcode);
    if (room === null) return;

    game.removePer(room, user, perI);
  });

  //============
  // disconnect
  //============
  socket.on("disconnect", () => {

  });
}