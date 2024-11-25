import { Schema, Types, model } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);

export default Message;
