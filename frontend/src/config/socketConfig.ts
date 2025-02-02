import { io } from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = import.meta.env.VITE_API_URL;

export const socket = io(ENDPOINT, {
  autoConnect: false,
});
