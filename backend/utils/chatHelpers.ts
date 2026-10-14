import { isValidObjectId } from "mongoose";
import Chat from "../models/chat";

// Returns the chat only if `userId` is one of its members, otherwise null.
// Invalid ids resolve to null instead of throwing a CastError.
export const findChatForMember = async (chatId: unknown, userId: unknown) => {
  if (!isValidObjectId(chatId) || !isValidObjectId(userId)) return null;

  return Chat.findOne({ _id: chatId, users: userId });
};
