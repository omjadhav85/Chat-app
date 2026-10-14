import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { findChatForMember } from "../utils/chatHelpers";

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "https://chat-app-e4z2.onrender.com",
    },
  });

  // Reject the connection unless the client sends a valid JWT.
  // The user id is taken from the token, never from client-sent data.
  io.use((socket, next) => {
    try {
      const decoded = jwt.verify(
        socket.handshake.auth?.token,
        process.env.JWT_SECRET!
      ) as { _id: string };
      socket.data.userId = decoded._id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId: string = socket.data.userId;

    // Each user only joins their own personal room. Chat events are fanned out
    // to members' personal rooms, so new chats and membership changes take
    // effect immediately and rooms are restored automatically on reconnect.
    socket.join(userId);
    socket.emit("connected");

    // Relays typing events only if the sender is a member of the chat
    const relayTyping = (event: string) => async (chatId: unknown) => {
      try {
        const chat = await findChatForMember(chatId, userId);
        if (!chat) return;

        emitToChatMembers(chat.users, event, chat._id.toString(), userId);
      } catch (err) {
        console.error(`Failed to relay "${event}":`, err);
      }
    };

    socket.on("typing start", relayTyping("typing start"));
    socket.on("typing stop", relayTyping("typing stop"));
  });
};

// Emits an event to every member's personal room, optionally skipping one user
export const emitToChatMembers = (
  memberIds: Types.ObjectId[],
  event: string,
  payload: unknown,
  excludeUserId?: string
) => {
  if (!io) return;

  const rooms = memberIds
    .map((id) => id.toString())
    .filter((id) => id !== excludeUserId);

  if (rooms.length > 0) io.to(rooms).emit(event, payload);
};
