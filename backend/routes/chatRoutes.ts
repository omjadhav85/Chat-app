import express from "express";
import { authCheck } from "../middlewares/authorize";
import {
  accessChatController,
  createGroupChat,
  fetchUserChatsController,
  renameGroup,
} from "../controllers/chatControllers";

const router = express.Router();

router.post("/", authCheck, accessChatController); // access existing chat - or create a new if it doesn't exist
router.get("/", authCheck, fetchUserChatsController); // fetch all chats of user
router.post("/group", authCheck, createGroupChat); // create group chat with given user ids and self
router.patch("/rename", authCheck, renameGroup);
// router.route("/groupremove").patch(protect, removeFromGroup);
// router.route("/groupadd").patch(protect, addToGroup);
export default router;
