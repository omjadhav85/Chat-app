import express from "express";

import expressAsyncHandler from "express-async-handler";
import { getAllUsersController } from "../controllers/userControllers";
import { authCheck } from "../middlewares/authorize";

const router = express.Router();

router.get("/", authCheck, expressAsyncHandler(getAllUsersController));

export default router;
