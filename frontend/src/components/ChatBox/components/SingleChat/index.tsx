import { Message } from "@/components/ChatBox/components/Message";
import { InputGroup } from "@/components/ui/input-group";
import axiosClient from "@/config/axiosConfig";
import { IMessage } from "@/lib/types";
import {
  getChatName,
  hasSentByChanged,
  isLoggedInUser,
  showError,
} from "@/lib/utils";
import { useDataStore } from "@/store";
import { Flex, Heading, Input, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import ScrollableFeed from "react-scrollable-feed";

export const SingleChat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");

  const selectedChat = useDataStore((state) => state.selectedChat);
  const refreshUserChats = useDataStore(
    (state) => state.actions.refreshUserChats
  );

  const sendMsg = async () => {
    setText("");
    try {
      const res = await axiosClient.post<IMessage>(`/api/messages`, {
        content: text,
        chatId: selectedChat?._id,
      });
      setMessages((prev) => [...prev, res.data]);
      refreshUserChats();
    } catch (error) {
      showError(error);
    }
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    sendMsg();
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosClient.get<IMessage[]>(
          `/api/messages/${selectedChat?._id}`
        );
        setMessages(res.data);
      } catch (error) {
        setMessages([]);
        showError(error);
      }
    };

    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  return (
    <Flex direction="column" gap={4} height="full">
      <Flex justify="space-between">
        <Heading>{selectedChat && getChatName(selectedChat)}</Heading>
      </Flex>
      <VStack
        flex={1}
        bgColor="#F3F6FF"
        borderRadius="4xl"
        justify="space-between"
        overflow="auto"
        p={2}
        alignItems="stretch"
      >
        <Flex direction="column" overflowY="auto" scrollbarWidth="none">
          <ScrollableFeed>
            {messages.map((item, i) => (
              <Message
                message={item}
                key={item._id}
                showAvatar={
                  !isLoggedInUser(item.sentBy) &&
                  hasSentByChanged(item, messages[i - 1])
                }
              />
            ))}
          </ScrollableFeed>
        </Flex>
        <InputGroup
          endElement={
            <IoArrowForwardCircleSharp
              size={30}
              cursor="pointer"
              onClick={() => sendMsg()}
            />
          }
        >
          <Input
            placeholder="Enter message"
            borderRadius="4xl"
            backgroundColor="white"
            outline="none"
            border="none"
            w="full"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleEnter}
          />
        </InputGroup>
      </VStack>
    </Flex>
  );
};
