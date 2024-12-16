import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chat";
import { ObjectId } from "mongoose";

export const accessChatController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const personId = req.body.id as ObjectId;

    if (!personId) {
      res.status(400);
      throw new Error("Person id not sent in req body");
    }

    const existingChat = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          users: {
            $elemMatch: { $eq: req.user!._id },
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

    if (existingChat.length > 0) {
      res.status(200).send(existingChat[0]);
      return;
    }

    //   an existing chat does not exist... so create a new one here

    const chatData = {
      name: "sender",
      isGroupChat: false,
      users: [req.user!._id, personId],
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
          $eq: req.user!._id,
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

export const createGroupChat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userIds = req.body.userIds as ObjectId[];
    const groupName = req.body.groupName as string;

    if (!userIds || userIds.length < 2) {
      res.status(400);
      throw new Error(
        "Minimum 2 users other than self are required to create a group chat"
      );
    }

    if (!groupName) {
      res.status(400);
      throw new Error("Please give a name to the group");
    }

    const data = await Chat.create({
      name: groupName,
      groupAdmin: req.user!._id,
      isGroupChat: true,
      users: userIds.concat(req.user!._id),
    });
    const fullChat = await Chat.findById(data._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.send(fullChat);
  }
);

export const renameGroup = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.body.groupId as ObjectId;
    const newName = req.body.newName as string;

    if (!groupId) {
      res.status(400);
      throw new Error("No group id sent in payload");
    }

    if (!newName) {
      res.status(400);
      throw new Error("Please give a name to the group");
    }

    const data = await Chat.findByIdAndUpdate(
      groupId,
      {
        name: newName,
      },
      {
        new: true,
      }
    );

    if (!data) {
      res.status(404);
      throw new Error("Chat with given Id not found!");
    }

    res.send(data);
  }
);

export const addToGroup = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.body.groupId as ObjectId;
    const userId = req.body.userId as ObjectId;

    if (!groupId) {
      res.status(400);
      throw new Error("No group id sent in payload");
    }

    if (!userId) {
      res.status(400);
      throw new Error("User id missing in payload");
    }

    // check if logged in user is admin of the group or not

    const groupData = await Chat.findById(groupId);

    if (!groupData) {
      res.status(404);
      throw new Error("Group chat with given Id not found!");
    }

    const canUserAdd = groupData.groupAdmin?.equals(req.user!._id);
    if (!canUserAdd) {
      res.status(401);
      throw new Error(
        "You do not have permission to add members to this group!"
      );
    }

    const data = await Chat.findByIdAndUpdate(
      groupId,
      {
        $addToSet: {
          users: userId,
        },
      },
      {
        new: true,
      }
    );

    res.send(data);
  }
);

export const removeFromGroup = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.body.groupId as ObjectId;
    const userId = req.body.userId as ObjectId;

    if (!groupId) {
      res.status(400);
      throw new Error("No group id sent in payload");
    }

    if (!userId) {
      res.status(400);
      throw new Error("User id missing in payload");
    }

    // check if logged in user is admin of the group or not

    const groupData = await Chat.findById(groupId);

    if (!groupData) {
      res.status(404);
      throw new Error("Group chat with given Id not found!");
    }

    const canUserAdd = groupData.groupAdmin?.equals(req.user!._id);
    if (!canUserAdd) {
      res.status(401);
      throw new Error(
        "You do not have permission to delete members from this group!"
      );
    }

    const data = await Chat.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          users: userId,
        },
      },
      {
        new: true,
      }
    );

    res.send(data);
  }
);
