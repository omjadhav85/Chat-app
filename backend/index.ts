import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares";
import { Server } from "socket.io";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to chat app api service" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log("Server has started on port: ", PORT)
);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chats", (chats) => {
    const chatIds = chats.map((chat) => chat._id);

    socket.join(chatIds);
  });

  socket.on("send msg", (msg) => {
    io.to(msg.chatId._id).emit("receive msg", msg);
  });
});
