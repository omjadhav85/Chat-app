import { io } from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = "https://chat-app-e4z2.onrender.com";

export const socket = io(ENDPOINT, {
  autoConnect: false,
});
