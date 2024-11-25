import express from "express";

import expressAsyncHandler from "express-async-handler";
import {
  loginController,
  signupController,
} from "../controllers/authControllers";

const router = express.Router();

router.post("/signup", expressAsyncHandler(signupController));

router.post("/login", expressAsyncHandler(loginController));

export default router;
