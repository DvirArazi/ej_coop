import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "/@src/shared/socketIoTypes";
import { onMount } from "svelte";

export let SOCKET: Socket<ServerToClientEvents, ClientToServerEvents>;
const USER_ID_STORAGE_KEY = "ej_coop_user_id";

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
      SOCKET.emit("registerId", localStorage.getItem(USER_ID_STORAGE_KEY), (idNew) => {
        if (idNew !== null) {
          localStorage.setItem(USER_ID_STORAGE_KEY, idNew)
        }
        onConnect();
      });
    });

    SOCKET.on("disconnect", onDisconnect);

    SOCKET.connect();
  });
}
