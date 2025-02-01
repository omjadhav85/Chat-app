import { Message } from "@/components/ChatBox/components/Message";
import { InputGroup } from "@/components/ui/input-group";
import axiosClient from "@/config/axiosConfig";
import { socket } from "@/config/socketConfig";
import { IMessage } from "@/lib/types";
import {
  getChatName,
  getOtherChatUser,
  hasSentByChanged,
  isLoggedInUser,
  showError,
} from "@/lib/utils";
import { useDataStore } from "@/store";
import { Flex, Heading, IconButton, Input, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import ScrollableFeed from "react-scrollable-feed";
import Lottie from "lottie-react";
import typingAnimation from "@/animations/typing-animation.json";
import { FiEdit, FiEye } from "react-icons/fi";
import { UserProfileModal } from "@/components/UserProfileModal";
import { GroupChatModal } from "@/components/ChatList/components/GroupChatModal";

export const SingleChat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isProfileModelOpen, setIsProfileModelOpen] = useState(false);
  const [isUpdateGroupModalOpen, setIsUpdateGroupModalOpen] = useState(false);

  const selectedChat = useDataStore((state) => state.selectedChat);
  const isSocketConnected = useDataStore((state) => state.isSocketConnected);
  const typingTimeoutId = useRef<NodeJS.Timeout>();
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

      socket.emit("send msg", res.data);
      refreshUserChats();
    } catch (error) {
      showError(error);
    }
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    sendMsg();
    clearTimeout(typingTimeoutId.current);
    socket.emit("typing stop", selectedChat?._id);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(typingTimeoutId.current);
    socket.emit("typing start", selectedChat?._id);
    setText(e.target.value);

    typingTimeoutId.current = setTimeout(() => {
      socket.emit("typing stop", selectedChat?._id);
    }, 2000);
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

  useEffect(() => {
    const addReceivedMsg = (msg: IMessage) => {
      if (isLoggedInUser(msg.sentBy) || selectedChat?._id !== msg.chatId._id) {
        // should add notification here. Code for this is in another event handler for same "receive msg" even
        return;
      }

      setMessages((prev) => [...prev, msg]);
    };
    if (isSocketConnected) {
      socket.on("receive msg", addReceivedMsg);
    }

    return () => {
      socket.off("receive msg", addReceivedMsg);
    };
  }, [isSocketConnected, selectedChat?._id]);

  useEffect(() => {
    socket.on(
      "typing start",
      (chatId) => selectedChat?._id === chatId && setIsTyping(true)
    );
    socket.on(
      "typing stop",
      (chatId) => selectedChat?._id === chatId && setIsTyping(false)
    );

    return () => {
      socket.off("typing start");
      socket.off("typing stop");
    };
  }, [selectedChat?._id]);

  return (
    <>
      <Flex direction="column" gap={4} height="full">
        <Flex justify="space-between" align="center">
          <Heading>{selectedChat && getChatName(selectedChat)}</Heading>
          {selectedChat?.isGroupChat ? (
            <IconButton
              variant="ghost"
              onClick={() => setIsUpdateGroupModalOpen(true)}
            >
              <FiEdit />
            </IconButton>
          ) : (
            <IconButton
              variant="ghost"
              onClick={() => setIsProfileModelOpen(true)}
            >
              <FiEye />
            </IconButton>
          )}
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
              {isTyping && (
                <Lottie
                  animationData={typingAnimation}
                  loop={true}
                  style={{
                    height: 80,
                    width: 100,
                    marginTop: "-20px",
                  }}
                />
              )}
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
              onChange={handleMessageChange}
              onKeyDown={handleEnter}
            />
          </InputGroup>
        </VStack>
      </Flex>

      <UserProfileModal
        isOpen={isProfileModelOpen}
        user={getOtherChatUser(selectedChat!)!}
        onChange={(e) => setIsProfileModelOpen(e.open)}
      />
      {isUpdateGroupModalOpen && (
        <GroupChatModal
          isOpen={isUpdateGroupModalOpen}
          onClose={() => setIsUpdateGroupModalOpen(false)}
          existingGroupChat={selectedChat!}
        />
      )}
    </>
  );
};
