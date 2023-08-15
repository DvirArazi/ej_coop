import type { Socket } from "socket.io";
import type { Game } from "/@src/lib/server/game";
import type { ClientToServerEvents, ServerToClientEvents } from "/@src/shared/socketIoTypes";
import type { User } from "/@src/lib/server/types";

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
    }

    callback(user.id);

    socket.emit("identified",
      user.name,
      user.rooms.map(room => {
        return {
          roomcode: room.code,
          isStoryteller: room.storyteller == user
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

      let isStoryteller: boolean;
      if (room.storyteller == user) {
        isStoryteller = true;
      }
      else if (room.personalities.includes(user)) {
        isStoryteller = false;
      } else {
        isStoryteller = false;
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