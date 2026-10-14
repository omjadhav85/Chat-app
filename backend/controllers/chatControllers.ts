import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chat";
import { ObjectId, Types } from "mongoose";
import { getFullChat } from "../utils/chatHelpers";
import { emitToChatMembers } from "../socket";

// Loads the full chat and pushes it to every current member (including the
// user who made the change, so their other tabs stay in sync)
const sendChatUpdate = async (chatId: Types.ObjectId) => {
  const fullChat = await getFullChat(chatId);
  if (!fullChat) return null;

  emitToChatMembers(fullChat.memberIds, "chat updated", fullChat.chat);

  return fullChat.chat;
};

// Tells users who were removed from a chat to drop it from their list
const sendChatRemoved = (chatId: Types.ObjectId, userIds: Types.ObjectId[]) => {
  emitToChatMembers(userIds, "chat removed", chatId.toString());
};

export const accessChatController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const personId = req.body.id as ObjectId;

    if (!personId) {
      res.status(400);
      throw new Error("Person id not sent in req body");
    }

    const existingChat = await Chat.findOne({
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
    });

    // Chat already exists: return it without notifying anyone
    if (existingChat) {
      const fullChat = await getFullChat(existingChat._id);
      res.status(200).send(fullChat?.chat);
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

      // Don't notify the other person yet: the chat appears for them when
      // the first message arrives (via "receive msg")
      const fullChat = await getFullChat(createdChat._id);
      res.status(200).send(fullChat?.chat);
    } catch (error: any) {
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
      // Hide 1:1 chats until they have at least one message
      $or: [{ isGroupChat: true }, { latestMsg: { $ne: null } }],
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMsg",
        populate: { path: "sentBy", select: "name pic email" },
      })
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

    const fullChat = await sendChatUpdate(data._id);

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

    // Only group chats can be renamed, and only by the group admin
    const groupData = await Chat.findById(groupId);

    if (!groupData || !groupData.isGroupChat) {
      res.status(404);
      throw new Error("Group chat with given Id not found!");
    }

    const isAdmin = groupData.groupAdmin?.equals(req.user!._id);
    if (!isAdmin) {
      res.status(401);
      throw new Error("You do not have permission to rename this group!");
    }

    groupData.name = newName;
    await groupData.save();

    const fullChat = await sendChatUpdate(groupData._id);

    res.send(fullChat);
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

    await Chat.findByIdAndUpdate(groupId, {
      $addToSet: {
        users: userId,
      },
    });

    // The new member receives the chat here too
    const fullChat = await sendChatUpdate(groupData._id);

    res.send(fullChat);
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

    await Chat.findByIdAndUpdate(groupId, {
      $pull: {
        users: userId,
      },
    });

    const fullChat = await sendChatUpdate(groupData._id);
    sendChatRemoved(groupData._id, [new Types.ObjectId(String(userId))]);

    res.send(fullChat);
  }
);

export const updateGroupController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.body.groupId as ObjectId;
    const userIds = req.body.userIds as ObjectId[];
    const groupName = req.body.name as string;

    if (!groupId) {
      res.status(400);
      throw new Error("No group id sent in payload");
    }

    if (!userIds || !Array.isArray(userIds)) {
      res.status(400);
      throw new Error("Updated members list is missing or invalid");
    }

    if (!groupName) {
      res.status(400);
      throw new Error("Group must have a name");
    }

    // Fetch group data to check admin permissions
    const groupData = await Chat.findById(groupId);

    if (!groupData) {
      res.status(404);
      throw new Error("Group chat with given Id not found!");
    }

    const isAdmin = groupData.groupAdmin?.equals(req.user!._id);
    if (!isAdmin) {
      res.status(401);
      throw new Error("You do not have permission to update this group!");
    }

    // Members in the old list but not the new one have been removed
    const newMemberIds = new Set(userIds.map(String));
    const removedUserIds = groupData.users.filter(
      (id) => !newMemberIds.has(id.toString())
    );

    // Update group members
    await Chat.findByIdAndUpdate(groupId, {
      $set: { users: userIds, name: groupName },
    });

    const fullChat = await sendChatUpdate(groupData._id);
    sendChatRemoved(groupData._id, removedUserIds);

    res.send(fullChat);
  }
);
