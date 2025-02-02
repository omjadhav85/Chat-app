import { ChatBox } from "@/components/ChatBox";
import { ChatList } from "@/components/ChatList";
import { Header } from "@/components/Header";
import { socket } from "@/config/socketConfig";
import { USER_DATA } from "@/lib/constants";
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

    socket.connect();
    socket.emit("setup", user);
    socket.on("connected", () => {
      console.log("socket connected");

      setStoreField("isSocketConnected", true);
    });
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));

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
