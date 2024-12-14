import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "@/components/ui/drawer";
import { InputGroup } from "@/components/ui/input-group";
import {
  DrawerOpenChangeDetails,
  Input,
  Separator,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import axiosClient from "@/config/axiosConfig";
import { showError } from "@/lib/utils";
import { AxiosResponse } from "axios";
import { IChat, IUser } from "@/lib/types";
import { UserListItem } from "@/components/ChatList/components/UserListItem";
import { useDataStore } from "@/store";

interface IProps {
  isOpen: boolean;
  onChange: (e: DrawerOpenChangeDetails) => void;
}

export const UsersDrawer = ({ isOpen, onChange }: IProps) => {
  const [searchText, setSearchText] = useState("");
  const [tempText, setTempText] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);

  const userChats = useDataStore((store) => store.userChats);
  const setStoreField = useDataStore((store) => store.actions.setStoreField);

  const timerId = useRef<NodeJS.Timeout | null>(null);

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
    if (timerId.current) clearTimeout(timerId.current);

    timerId.current = setTimeout(() => {
      setSearchText(tempText);
    }, 500);

    return () => {
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, [tempText]);

  useEffect(() => {
    const fetchUsersBySearch = async () => {
      if (searchText.trim() === "") {
        setUsers([]);
        return;
      }

      try {
        const res = await axiosClient.get<IUser[]>("/api/users", {
          params: {
            search: searchText,
          },
        });

        setUsers(res?.data || []);
      } catch (error) {
        showError(error);
      }
    };

    fetchUsersBySearch();
  }, [searchText]);

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
