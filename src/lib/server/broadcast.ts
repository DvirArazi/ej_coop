export const ROOM_UPDATED_EVENT = "room_updated";
export const ROOM_DELETED_EVENT = "room_deleted";

type RoomEventName = typeof ROOM_UPDATED_EVENT | typeof ROOM_DELETED_EVENT;
type RoomSubscriber = (
  eventName: RoomEventName,
  payload: Record<string, unknown>,
) => void;

declare global {
  // eslint-disable-next-line no-var
  var __ejCoopRoomSubscribers__:
    | Map<string, Set<RoomSubscriber>>
    | undefined;
}

const roomSubscribers =
  globalThis.__ejCoopRoomSubscribers__ ?? new Map<string, Set<RoomSubscriber>>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__ejCoopRoomSubscribers__ = roomSubscribers;
}

function publishRoomEvent(
  roomcode: string,
  
  eventName: RoomEventName,
): void {
  for (const subscriber of roomSubscribers.get(roomcode) ?? []) {
    subscriber(eventName, { roomcode });
  }
}

export function subscribeToRoomEvents(
  roomcode: string,
  subscriber: RoomSubscriber,
): () => void {
  const subscribers = roomSubscribers.get(roomcode) ?? new Set<RoomSubscriber>();
  subscribers.add(subscriber);
  roomSubscribers.set(roomcode, subscribers);

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      roomSubscribers.delete(roomcode);
    }
  };
}

export async function broadcastRoomUpdated(roomcode: string): Promise<void> {
  publishRoomEvent(roomcode, ROOM_UPDATED_EVENT);
}

export async function broadcastRoomDeleted(roomcode: string): Promise<void> {
  publishRoomEvent(roomcode, ROOM_DELETED_EVENT);
}
