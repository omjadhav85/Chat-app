import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const generateToken = (id: Types.ObjectId) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

export default generateToken;
