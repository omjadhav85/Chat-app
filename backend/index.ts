import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares";

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

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log("Server has started on port: ", PORT));
