import { USER_DATA } from "@/lib/constants";
import { io } from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = import.meta.env.VITE_API_URL;

export const socket = io(ENDPOINT, {
  autoConnect: false,
  // Called on every (re)connect, so the server always gets the current token
  auth: (cb) => {
    const userData = JSON.parse(localStorage.getItem(USER_DATA) || "{}");
    cb({ token: userData.token });
  },
});
