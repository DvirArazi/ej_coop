import type { Socket } from "socket.io";
import type { Game } from "src/lib/server/game";
import type { ClientToServerEvents, ServerToClientEvents } from "src/shared/socketIoTypes";
import type { User } from "src/lib/server/types";
import type { Role } from "src/shared/types";
import { v4 as uuidv4 } from 'uuid';

export function handleSocket(
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  game: Game
) {

  //=========
  // checkId
  //=========
  socket.on("checkId", (id, callback) => {
    let user: User | undefined;
    if (id == undefined || (user = game.findUserById(id)) == undefined) {
      user = game.addUser(socket.id);
    }
    else {
      user.socketId = socket.id;
      console.log("user after reconnection: ", user);
    }

    callback(user.id);

    socket.emit("identified",
      user.name,
      user.rooms.map(room => {
        return {
          roomcode: room.code,
          role: room.storyteller == user ? "storyteller" : "personality"
        }
      })
    );
  });


  //============
  // updateName
  //============
  socket.on("updateName", name => {
    const user = game.findUserBySocketId(socket.id);
    if (user == undefined) return;

    game.updateUserName(user, name);
  });


  //============
  // createRoom
  //============
  socket.on("createRoom", callback => {
    const user = game.findUserBySocketId(socket.id);
    if (user == undefined) return;

    const roomcode = game.createRoom(user);

    callback(roomcode);
  });

  //===========
  // enterRoom
  //===========
  socket.on("enterRoom", (roomcode, callback) => {
    callback((() => {
      const user = game.findUserBySocketId(socket.id);
      if (user == undefined) return undefined;
      const room = game.findRoomByRoomcode(roomcode);
      if (room == undefined) return undefined;

      let role: Role;
      if (room.storyteller == user) {
        role = "storyteller";
      }
      else if (room.personalities.includes(user)) {
        role = "personality";
      } else {
        role = "personality";
        game.addPersonality(room, user);
      }

      return game.getGameData(room, user);
    })());
  });

  //===============
  // doesRoomExist
  //===============
  socket.on("doesRoomExist", (roomcode, callback) => {
    callback(game.findRoomByRoomcode(roomcode) != undefined);
  });

  //============
  // disconnect
  //============
  socket.on("disconnect", () => {

  });
}