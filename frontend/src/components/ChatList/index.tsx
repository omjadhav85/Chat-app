import { UserChatList } from "@/components/ChatList/components/UserChatList";
import { TitleAndActions } from "@/components/ChatList/components/TitleAndActions";
import { Stack } from "@chakra-ui/react";
import { useDataStore } from "@/store";

export const ChatList = () => {
  const selectedChat = useDataStore((state) => state.selectedChat);

  return (
    <Stack
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flex={3}
      borderRadius="4xl"
      backgroundColor="white"
      p="4"
    >
      <TitleAndActions />
      <UserChatList />
    </Stack>
  );
};
