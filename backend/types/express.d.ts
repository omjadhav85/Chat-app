import { Request } from "express";
import { ObjectId } from "mongoose"; // Or your User type

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: ObjectId;
      };
    }
  }
}
