import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chat";
import { ObjectId } from "mongoose";

export const accessChatController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const personId = req.body.id as ObjectId;

    console.log("personId", personId);

    if (!personId) {
      res.status(400);
      throw new Error("Person id not sent in req body");
    }

    const existingChat = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          users: {
            $elemMatch: { $eq: req.user._id },
          },
        },
        {
          users: {
            $elemMatch: { $eq: personId },
          },
        },
      ],
    })
      .populate("users", "-password")
      .populate("latestMsg");

    console.log("existingChat: ", existingChat);

    if (existingChat.length > 0) {
      res.status(200).send(existingChat[0]);
      return;
    }

    //   an existing chat does not exist... so create a new one here

    const chatData = {
      name: "sender",
      isGroupChat: false,
      users: [req.user._id, personId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);

export const fetchUserChatsController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = await Chat.find({
      users: {
        $elemMatch: {
          $eq: req.user._id,
        },
      },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMsg")
      .sort({ updatedAt: -1 });

    res.send(data);
  }
);
