import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../models/message";
import Chat from "../models/chat";

export const sendMsgController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) throw new Error("Invalid request body");

    try {
      const msgData = {
        chatId: chatId,
        content: content,
        sentBy: req.user?._id,
      };
      let newMsg = await Message.create(msgData);

      newMsg = await newMsg.populate("sentBy", "name pic email");
      newMsg = await newMsg.populate("chatId", "users groupAdmin");

      await Chat.findByIdAndUpdate(chatId, { latestMsg: newMsg });

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

    if (!chatId) throw new Error("Invalid request body");

    try {
      const data = await Message.find({
        chatId: chatId,
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
