import { socket } from "@/config/socketConfig";
import { USER_DATA } from "@/lib/constants";

// Ends the session when the server rejects the token (expired or invalid).
// A full page load to "/" also resets all in-memory app state.
export const forceLogout = () => {
  socket.disconnect();
  localStorage.removeItem(USER_DATA);
  window.location.replace("/");
};
