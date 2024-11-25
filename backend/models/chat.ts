import { Schema, Types, model } from "mongoose";

const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    latestMsg: {
      type: Schema.Types.ObjectId,
      ref: "Msg",
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", chatSchema);

export default Chat;
