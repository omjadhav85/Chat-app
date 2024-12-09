import { ChatBox } from "@/components/ChatBox";
import { ChatList } from "@/components/ChatList";
import { Header } from "@/components/Header";
import { useDataStore } from "@/store";
import { Box } from "@chakra-ui/react";

export const ChatsPage = () => {
  const user = useDataStore((store) => store.user);

  return (
    <Box>
      {!!user && <Header />}
      <Box display="flex" gap="1rem" bgColor="aliceblue">
        <ChatList />
        <ChatBox />
      </Box>
    </Box>
  );
};
