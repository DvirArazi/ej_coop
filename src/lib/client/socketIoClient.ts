import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "src/shared/socketIoTypes";
import { onMount } from "svelte";
import { getCookie, setCookie } from "typescript-cookie";

export let SOCKET: Socket<ServerToClientEvents, ClientToServerEvents> = io();

export function initSocketIoClient() {
  onMount(() => {
    SOCKET.emit("checkId", getCookie("id"), (idNew) => {
      if (idNew == null) return;

      setCookie("id", idNew);
    });
  });
}