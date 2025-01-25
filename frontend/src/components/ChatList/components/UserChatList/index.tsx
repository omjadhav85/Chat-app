import { ChatListItem } from "@/components/ChatList/components/ChatListItem";
import { InputGroup } from "@/components/ui/input-group";
import { IChat } from "@/lib/types";
import { useDataStore } from "@/store";
import { Input, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuSearch } from "react-icons/lu";

export const UserChatList = () => {
  const userChats = useDataStore((store) => store.userChats);
  const refreshUserChats = useDataStore(
    (store) => store.actions.refreshUserChats
  );
  const setSelectedChat = useDataStore(
    (store) => store.actions.setSelectedChat
  );

  const handleSelectChat = (chat: IChat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    refreshUserChats();
  }, []);
  return (
    <>
      <InputGroup endElement={<LuSearch />}>
        <Input
          placeholder="Search name"
          borderRadius="4xl"
          backgroundColor="#F3F6FF"
          outline="none"
          border="none"
        />
      </InputGroup>

      <VStack overflow="auto" gap={2}>
        {userChats.map((chat) => {
          return (
            <ChatListItem
              key={chat._id}
              chat={chat}
              onClick={handleSelectChat}
            />
          );
        })}
      </VStack>
    </>
  );
};
