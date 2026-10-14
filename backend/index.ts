import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares";
import { initSocket } from "./socket";
import path from "path";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.json({
    msg: "Hello from chat app backend",
    time: new Date().toISOString(),
  });
});

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
initSocket(server);
