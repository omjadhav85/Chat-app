import { ChatListItem } from "@/components/ChatList/components/ChatListItem";
import { InputGroup } from "@/components/ui/input-group";
import axiosClient from "@/config/axiosConfig";
import { IChat } from "@/lib/types";
import { showError } from "@/lib/utils";
import { useDataStore } from "@/store";
import { Input, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuSearch } from "react-icons/lu";

export const UserChatList = () => {
  const userChats = useDataStore((store) => store.userChats);
  const setStoreField = useDataStore((store) => store.actions.setStoreField);
  const setSelectedChat = useDataStore(
    (store) => store.actions.setSelectedChat
  );

  const handleSelectChat = (chat: IChat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        const res = await axiosClient.get<IChat[]>("/api/chats");

        setStoreField("userChats", res.data || []);
      } catch (error) {
        showError(error);
      }
    };

    fetchUserChats();
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
