import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "/@src/shared/socketIoTypes";
import { onMount } from "svelte";
import { getCookie, setCookie } from "typescript-cookie";

export let SOCKET: Socket<ServerToClientEvents, ClientToServerEvents>;
const USER_ID_COOKIE_KEY = "id";
const USER_ID_STORAGE_KEY = "ej_coop_user_id";

function getStoredUserId(): string | null {
  const idFromCookie = getCookie(USER_ID_COOKIE_KEY);
  if (idFromCookie !== undefined && idFromCookie !== "") return idFromCookie;

  try {
    const idFromStorage = localStorage.getItem(USER_ID_STORAGE_KEY);
    return idFromStorage !== null && idFromStorage !== "" ? idFromStorage : null;
  } catch {
    return null;
  }
}

function persistUserId(id: string): void {
  setCookie(USER_ID_COOKIE_KEY, id, { path: "/" });

  try {
    localStorage.setItem(USER_ID_STORAGE_KEY, id);
  } catch { }
}

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
      SOCKET.emit("registerId", getStoredUserId(), (idNew) => {
        if (idNew !== null) {
          persistUserId(idNew);
        }
        onConnect();
      });
    });

    SOCKET.on("disconnect", onDisconnect);

    SOCKET.connect();
  });
}
