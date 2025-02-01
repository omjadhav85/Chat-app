import { Box, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDataStore } from "@/store";
import { getChatName } from "@/lib/utils";
import { IMessage } from "@/lib/types";

export const NotificationBell = () => {
  const notifications = useDataStore((s) => s.notifications);
  const setStoreField = useDataStore((s) => s.actions.setStoreField);

  const handleNotificationClick = (clickedMsg: IMessage) => {
    setStoreField("selectedChat", clickedMsg.chatId);

    const updatedNotifications = notifications.filter(
      (m) => m.chatId._id !== clickedMsg.chatId._id
    );

    setStoreField("notifications", updatedNotifications);
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Box position="relative">
          <Icon size="2xl" cursor="pointer" position="relative">
            <IoNotificationsOutline />
          </Icon>
          {notifications.length > 0 && (
            <Flex
              h={4}
              w={4}
              align="center"
              justify="center"
              bgColor="red"
              position="absolute"
              right={-2}
              top={-2}
              color="white"
              borderRadius="full"
              p={3}
            >
              {notifications.length > 99 ? "99+" : notifications.length}
            </Flex>
          )}
        </Box>
      </MenuTrigger>
      <MenuContent>
        {notifications.map((msg) => {
          return (
            <MenuItem
              value="new-txt"
              onClick={() => handleNotificationClick(msg)}
            >
              <VStack align="flex-start">
                <Heading size="md">
                  {msg.chatId.isGroupChat
                    ? `New message in ${getChatName(msg.chatId)}`
                    : `New message from ${getChatName(msg.chatId)}`}
                </Heading>
                <Text>{msg.content}</Text>
              </VStack>
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
