import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../models/message";
import Chat from "../models/chat";
import User from "../models/user";
import { findChatForMember } from "../utils/chatHelpers";
import { emitToChatMembers } from "../socket";

export const sendMsgController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { content, chatId } = req.body;

    if (typeof content !== "string" || !content.trim() || !chatId) {
      res.status(400);
      throw new Error("Invalid request body");
    }

    // Only members of a chat are allowed to post in it
    const chat = await findChatForMember(chatId, req.user!._id);
    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    try {
      const msgData = {
        chatId: chat._id,
        content: content,
        sentBy: req.user!._id,
      };
      let newMsg = await Message.create(msgData);

      newMsg = await newMsg.populate("sentBy", "name pic email");
      newMsg = await newMsg.populate("chatId");

      newMsg = await User.populate(newMsg, {
        path: "chatId.users",
        select: "name pic email",
      });

      await Chat.findByIdAndUpdate(chat._id, { latestMsg: newMsg });

      // Broadcast from the server (not the client) so the message can't be
      // spoofed, delivered to every other member's personal room
      emitToChatMembers(
        chat.users,
        "receive msg",
        newMsg,
        req.user!._id.toString()
      );

      res.json(newMsg);
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);

export const getChatMsgsController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.params;

    // Only members of a chat are allowed to read its messages
    const chat = await findChatForMember(chatId, req.user!._id);
    if (!chat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    try {
      const data = await Message.find({
        chatId: chat._id,
      })
        .populate("sentBy", "name pic email")
        .populate("chatId");

      res.json(data);
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);
