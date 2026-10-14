import { Request, Response } from "express";
import User from "../models/user";

// Escapes regex special characters so user input is matched literally
const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAllUsersController = async (req: Request, res: Response) => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const searchRegex = new RegExp(escapeRegex(search), "i");
  const query = search
    ? {
        $or: [
          // search name and email fields
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
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
