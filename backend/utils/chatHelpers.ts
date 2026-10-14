import { isValidObjectId, Types } from "mongoose";
import Chat from "../models/chat";

// Returns the chat only if `userId` is one of its members, otherwise null.
// Invalid ids resolve to null instead of throwing a CastError.
export const findChatForMember = async (chatId: unknown, userId: unknown) => {
  if (!isValidObjectId(chatId) || !isValidObjectId(userId)) return null;

  return Chat.findOne({ _id: chatId, users: userId });
};

// Loads a chat in the shape the client expects everywhere: members, admin
// and latest message (with its sender) populated
export const getFullChat = async (chatId: Types.ObjectId) => {
  const chat = await Chat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMsg",
      populate: { path: "sentBy", select: "name pic email" },
    });

  if (!chat) return null;

  // `users` is populated above, so each entry is a user document
  const memberIds = (chat.users as unknown as { _id: Types.ObjectId }[]).map(
    (user) => user._id
  );

  return { chat, memberIds };
};
