import express from "express";
import { authCheck } from "../middlewares/authorize";
import {
  getChatMsgsController,
  sendMsgController,
} from "../controllers/messageControllers";

const router = express.Router();

router.post("/", authCheck, sendMsgController);
router.get("/:chatId", authCheck, getChatMsgsController);

export default router;
