import { Request, Response } from "express";
import User from "../models/user";

export const getAllUsersController = async (req: Request, res: Response) => {
  const search = req.query.search as string | null;
  const query = search
    ? {
        $or: [
          // search name and email fields
          { name: { $regex: new RegExp(search, "i") } },
          { email: { $regex: new RegExp(search, "i") } },
        ],
      }
    : {};

  const data = await User.find(query)
    .find({
      _id: {
        $ne: req.user._id,
      },
    })
    .select("-password"); // do not select password field while sending response
  res.json(data);
};
