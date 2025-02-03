import { ChatListItem } from "@/components/ChatList/components/ChatListItem";
import { InputGroup } from "@/components/ui/input-group";
import { socket } from "@/config/socketConfig";
import { IChat, IMessage } from "@/lib/types";
import { getChatName, isLoggedInUser } from "@/lib/utils";
import { useDataStore } from "@/store";
import { Input, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";

export const UserChatList = () => {
  const [searchText, setSearchText] = useState("");

  const userChats = useDataStore((store) => store.userChats);
  const isSocketConnected = useDataStore((store) => store.isSocketConnected);
  const selectedChat = useDataStore((store) => store.selectedChat);
  const notifications = useDataStore((store) => store.notifications);

  const refreshUserChats = useDataStore(
    (store) => store.actions.refreshUserChats
  );
  const setSelectedChat = useDataStore(
    (store) => store.actions.setSelectedChat
  );
  const setStoreField = useDataStore((store) => store.actions.setStoreField);

  const handleSelectChat = (chat: IChat) => {
    setSelectedChat(chat);
  };

  const handleSearchChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredChats = useMemo(() => {
    if (!searchText) return userChats;

    return userChats.filter((chat) =>
      chat.isGroupChat
        ? chat.name.toLowerCase().includes(searchText.toLowerCase())
        : getChatName(chat)?.toLowerCase()?.includes(searchText.toLowerCase())
    );
  }, [searchText, userChats]);

  useEffect(() => {
    refreshUserChats();
  }, []);

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("join chats", userChats);
    }
  }, [isSocketConnected, userChats]);

  useEffect(() => {
    const handleReceiveMsg = (msg: IMessage) => {
      if (isLoggedInUser(msg.sentBy) || selectedChat?._id === msg.chatId._id) {
        return;
      }

      setStoreField("notifications", [...notifications, msg]);
    };
    if (isSocketConnected) {
      socket.on("receive msg", handleReceiveMsg);
    }

    return () => {
      socket.off("receive msg", handleReceiveMsg);
    };
  }, [isSocketConnected, notifications, selectedChat?._id, setStoreField]);
  return (
    <>
      <InputGroup endElement={<LuSearch />}>
        <Input
          placeholder="Search chats"
          borderRadius="4xl"
          backgroundColor="#F3F6FF"
          outline="none"
          border="none"
          onChange={handleSearchChat}
        />
      </InputGroup>

      <VStack overflow="auto" gap={2}>
        {filteredChats.map((chat) => {
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
