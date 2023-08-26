import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "/@src/shared/socketIoTypes";
import { onMount } from "svelte";
import { getCookie, setCookie } from "typescript-cookie";

export let SOCKET: Socket<ServerToClientEvents, ClientToServerEvents>;

export function initSocketIoClient(onConnect: () => void, onDisconnect: () => void): void {
  onMount(() => {
    SOCKET = io({
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    SOCKET.on("connect", () => {
      const id = getCookie("id");
      SOCKET.emit("registerId", id !== undefined ? id : null, (idNew) => {
        if (idNew === null) return;
        setCookie("id", idNew);
      });

      onConnect();
    });

    SOCKET.on("disconnect", onDisconnect);

    SOCKET.connect();
  });;
}