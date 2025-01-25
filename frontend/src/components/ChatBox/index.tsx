import { SingleChat } from "@/components/ChatBox/components/SingleChat";
import { useDataStore } from "@/store";
import { Box, Flex } from "@chakra-ui/react";
import React from "react";

export const ChatBox = () => {
  const selectedChat = useDataStore((state) => state.selectedChat);

  return (
    <Box flex={7} borderRadius="4xl" backgroundColor="white" p="4">
      {selectedChat ? (
        <SingleChat />
      ) : (
        <Flex alignItems="center" justifyContent="center" height="full">
          Select a chat
        </Flex>
      )}
    </Box>
  );
};
