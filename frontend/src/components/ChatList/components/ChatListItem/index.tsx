import { Avatar } from "@/components/ui/avatar";
import { IChat } from "@/lib/types";
import { getChatName, getOtherChatUser } from "@/lib/utils";
import { Flex, Heading, Text, VStack } from "@chakra-ui/react";

interface Props {
  chat: IChat;
  onClick: (chat: IChat) => void;
}

export const ChatListItem = ({ chat, onClick }: Props) => {
  return (
    <Flex
      alignItems="center"
      gap={2}
      borderRadius="lg"
      bg="#F3F6FF"
      p={2}
      w={"full"}
      cursor="pointer"
      _hover={{
        bg: "#dfe7ff",
      }}
      onClick={() => onClick(chat)}
    >
      <Avatar
        name={getChatName(chat)}
        src={chat.isGroupChat ? "" : getOtherChatUser(chat)?.pic}
      />
      <VStack justifyContent="space-between" alignItems="flex-start">
        <Heading size="sm">{getChatName(chat)}</Heading>
        <Text fontSize="xs">{chat.latestMsg?.content || "Start chat..."}</Text>
      </VStack>
    </Flex>
  );
};
