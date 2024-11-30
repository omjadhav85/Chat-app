import express from "express";
import { authCheck } from "../middlewares/authorize";
import {
  accessChatController,
  fetchUserChatsController,
} from "../controllers/chatControllers";

const router = express.Router();

router.post("/", authCheck, accessChatController); // access existing chat - or create a new if it doesn't exist
router.get("/", authCheck, fetchUserChatsController); // fetch all chats of user
// router.route("/group").post(protect, createGroupChat);
// router.route("/rename").put(protect, renameGroup);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);
export default router;
