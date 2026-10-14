import { ChatBox } from "@/components/ChatBox";
import { ChatList } from "@/components/ChatList";
import { Header } from "@/components/Header";
import { socket } from "@/config/socketConfig";
import { USER_DATA } from "@/lib/constants";
import { forceLogout } from "@/lib/session";
import { useDataStore } from "@/store";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ChatsPage = () => {
  const user = useDataStore((store) => store.user);
  const navigate = useNavigate();

  const setStoreField = useDataStore((store) => store.actions.setStoreField);
  useEffect(() => {
    const userData = localStorage.getItem(USER_DATA);

    if (!userData) {
      navigate("/");
      return;
    }

    // The server identifies the user from the JWT sent in the handshake
    // and joins their personal room, so no "setup" event is needed
    const handleConnected = () => {
      console.log("socket connected");

      setStoreField("isSocketConnected", true);
    };

    // The server rejects the handshake when the token is expired or invalid
    const handleConnectError = (err: Error) => {
      if (err.message === "Unauthorized") forceLogout();
    };

    socket.on("connected", handleConnected);
    socket.on("connect_error", handleConnectError);
    socket.connect();

    return () => {
      socket.off("connected", handleConnected);
      socket.off("connect_error", handleConnectError);
    };

    // eslint-disable-next-line
  }, []);

  return (
    <Box>
      {!!user && <Header />}
      <Box
        display="flex"
        gap="1rem"
        bgColor="#F3F6FF"
        padding="1rem"
        height="calc(100vh - 4.25rem)"
      >
        <ChatList />
        <ChatBox />
      </Box>
    </Box>
  );
};
