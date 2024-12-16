import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "@/components/ui/drawer";
import { InputGroup } from "@/components/ui/input-group";
import { DrawerOpenChangeDetails, Input, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import axiosClient from "@/config/axiosConfig";
import { showError } from "@/lib/utils";
import { IChat, IUser } from "@/lib/types";
import { UserListItem } from "@/components/ChatList/components/UserListItem";
import { useDataStore } from "@/store";
import { useSearchUsers } from "@/hooks/useSearchUsers";

interface IProps {
  isOpen: boolean;
  onChange: (e: DrawerOpenChangeDetails) => void;
}

export const UsersDrawer = ({ isOpen, onChange }: IProps) => {
  const [tempText, setTempText] = useState("");

  const userChats = useDataStore((store) => store.userChats);
  const setStoreField = useDataStore((store) => store.actions.setStoreField);

  const { users, fetchUsersBySearch } = useSearchUsers();

  const handleSelectUser = async (selectedUser: IUser) => {
    try {
      const res = await axiosClient.post<IChat>("/api/chats", {
        id: selectedUser._id,
      });

      if (!userChats.some((chat) => chat._id === res.data._id)) {
        setStoreField("userChats", [res.data, ...userChats]);
      }
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    fetchUsersBySearch(tempText);
  }, [fetchUsersBySearch, tempText]);

  return (
    <DrawerRoot open={isOpen} onOpenChange={onChange} placement="start">
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Users</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <InputGroup endElement={<LuSearch />} w="full">
            <Input
              placeholder="Search by name or email"
              borderRadius="4xl"
              backgroundColor="#F3F6FF"
              outline="none"
              border="none"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
            />
          </InputGroup>
          <VStack gap={2} mt={4}>
            {users.map((userObj) => (
              <UserListItem
                user={userObj}
                key={userObj._id}
                onClick={handleSelectUser}
              />
            ))}
          </VStack>
        </DrawerBody>

        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};
