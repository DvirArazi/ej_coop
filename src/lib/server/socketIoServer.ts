import type * as http from "http";
import { Server } from "socket.io";
import { Game } from "src/lib/server/game";
import type { Room, UserServer } from "src/lib/server/types";
import type { ClientToServerEvents, ServerToClientEvents } from "src/shared/socketIoTypes";
import type { Role, User } from "src/shared/types";
import { v4 as uuidv4 } from 'uuid';

export default function initSocketIoServer(httpServer: http.Server) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
  const game = new Game();

  io.on("connection", (socket) => {
    

    //=========
    // checkId
    //=========
    socket.on("checkId", (cookieId, callback) => {
      let userServer: UserServer | undefined;
      if (
        cookieId == undefined ||
        (userServer = users.find((value) => value.cookieId == cookieId)) == undefined
      ) {
        userServer = {
          socketId: socket.id,
          cookieId: uuidv4(),
          name: "",
          rooms: []
        };
        users.push(userServer);
      }
      else {
        userServer.socketId = socket.id;
        console.log("user after reconnection: ", userServer);
      }

      callback(userServer.cookieId);
      socket.emit("identified", userServerToUser(userServer));
    });


    //============
    // updateName
    //============
    socket.on("updateName", name => {
      const user = users.find(value => value.socketId == socket.id);
      if (user == undefined) return;

      user.name = name;
    });


    //============
    // createRoom
    //============
    socket.on("createRoom", callback => {
      const user = users.find(value => value.socketId == socket.id);
      if (user == undefined) return;

      const roomcode = generateRoomcode(rooms.map(room => room.code));
      const room = {
        code: roomcode,
        storyteller: user,
        personalities: [],
        attemptsLeft: 3,
      }

      rooms.push(room);
      user.rooms.push(room);

      callback(roomcode);
    });

    //===========
    // enterRoom
    //===========
    socket.on("enterRoom", (roomcode, callback) => {
      callback((() => {
        const user = users.find(value => value.socketId == socket.id);
        if (user == undefined) return undefined;
        const room = rooms.find(value => value.code == roomcode);
        if (room == undefined) return undefined;

        let role: Role;
        if (room.storyteller == user.cookieId) {
          role = "storyteller";
        }
        else if (room.personalities.includes(user.cookieId)) {
          role = "personality";
        } else {
          role = "personality";
          room.personalities.push(user.cookieId);
          user.associantions.push({
            role: role,
            roomcode: roomcode,
          });

        }

        return {
          role: role,
          persNames: room.personalities
            .map(id => users.find(user => user.cookieId == id)!.name),
          attemptsLeft: room.attemptsLeft,
        };
      })());
    });

    //===============
    // doesRoomExist
    //===============
    socket.on("doesRoomExist", (roomcode, callback) => {
      callback(rooms.find(room => room.code == roomcode) != undefined);
    });

    //============
    // disconnect
    //============
    socket.on("disconnect", () => {

    });
  });
}

function userServerToUser(userServer: UserServer): User {
  return {
    name: userServer.name,
    associantions: userServer.associantions,
  };
}