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
import path from "path";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// deployment

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "../frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ msg: "Welcome to chat app api service" });
  });
}

//

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

  socket.on("typing start", (chatId) => {
    socket.to(chatId).emit("typing start", chatId);
  });
  socket.on("typing stop", (chatId) => {
    socket.to(chatId).emit("typing stop", chatId);
  });
});
