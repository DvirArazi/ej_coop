import type * as http from "http";
import { Server } from "socket.io";
import type { Room, UserServer } from "src/lib/server/types";
import type { ClientToServerEvents, ServerToClientEvents } from "src/shared/socketIoTypes";
import type { Role, User } from "src/shared/types";
import { v4 as uuidv4 } from 'uuid';

export default function initSocketIoServer(httpServer: http.Server) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
  const users: UserServer[] = [];
  const rooms: Room[] = [];

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
          associantions: []
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

      rooms.push({
        code: roomcode,
        storytellerId: user.cookieId,
        personalitiesIds: [],
        attemptsLeft: 3,
      });
      user.associantions.push({
        roomcode: roomcode,
        role: "storyteller",
      });

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
        if (room.storytellerId == user.cookieId) {
          role = "storyteller";
        }
        else if (room.personalitiesIds.includes(user.cookieId)) {
          role = "personality";
        } else {
          room.personalitiesIds.push(user.cookieId);
          role = "personality";
        }

        return {
          role: role,
          persNames: room.personalitiesIds
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

function generateRoomcode(roomcodes: string[]) {
  const aCode = "A".charCodeAt(0);
  const zCode = "Z".charCodeAt(0);

  let roomcode = "";
  do {
    for (let i = 0; i < 4; i++) {
      roomcode += String.fromCharCode(
        aCode + Math.floor(Math.random() * (zCode - aCode + 1))
      );
    }
  } while (roomcodes.includes(roomcode));

  return roomcode;
}