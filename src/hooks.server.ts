import type { Handle } from "@sveltejs/kit";
import type { Server as HttpServer } from "http";
import { initSocketIoServer } from "/@src/lib/server/socketIoServer";

export { initSocketIoServer } from "/@src/lib/server/socketIoServer";

export const handle: Handle = async ({ event, resolve }) => {
  const platform = event.platform as { req?: { socket?: { server?: HttpServer } } } | undefined;
  const httpServer = platform?.req?.socket?.server;

  if (httpServer !== undefined) {
    initSocketIoServer(httpServer);
  }

  return resolve(event);
};
