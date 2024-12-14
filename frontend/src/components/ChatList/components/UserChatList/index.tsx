import { UserListItem } from "@/components/ChatList/components/UserListItem";
import { InputGroup } from "@/components/ui/input-group";
import axiosClient from "@/config/axiosConfig";
import { IChat } from "@/lib/types";
import { showError } from "@/lib/utils";
import { useDataStore } from "@/store";
import { Box, Input, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { LuSearch } from "react-icons/lu";

export const UserChatList = () => {
  const userChats = useDataStore((store) => store.userChats);
  const user = useDataStore((store) => store.user);
  const setStoreField = useDataStore((store) => store.actions.setStoreField);

  const getChatPerson = (chat: IChat) => {
    return chat.users.find((u) => u._id !== user?._id);
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
          const chatPerson = getChatPerson(chat);
          return (
            <UserListItem
              key={chat._id}
              user={chatPerson!}
              onClick={() => {}}
            />
          );
        })}
      </VStack>
    </>
  );
};
