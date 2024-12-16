import { Button } from "@/components/ui/button";
import { Heading, HStack } from "@chakra-ui/react";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

import { useState } from "react";
import { UsersDrawer } from "@/components/ChatList/components/UsersDrawer";
import { GroupChatModal } from "@/components/ChatList/components/GroupChatModal";

export const TitleAndActions = () => {
  const [isUsersDrawerOpen, setIsUsersDrawerOpen] = useState(false);
  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);

  return (
    <>
      <HStack justifyContent="space-between">
        <Heading>Chats</Heading>

        <MenuRoot>
          <MenuTrigger asChild>
            <Button variant="ghost" borderRadius="full">
              <FiMoreHorizontal />
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              value="new-chat"
              cursor="pointer"
              onClick={() => setIsUsersDrawerOpen(true)}
            >
              New chat
            </MenuItem>
            <MenuItem
              value="new-group-chat"
              cursor="pointer"
              onClick={() => setIsGroupChatModalOpen(true)}
            >
              New group chat
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </HStack>
      {isUsersDrawerOpen && (
        <UsersDrawer
          isOpen={isUsersDrawerOpen}
          onChange={(e) => setIsUsersDrawerOpen(e.open)}
        />
      )}
      {isGroupChatModalOpen && (
        <GroupChatModal
          isOpen={isGroupChatModalOpen}
          onClose={() => setIsGroupChatModalOpen(false)}
        />
      )}
    </>
  );
};
