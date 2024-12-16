import React, { useEffect, useMemo, useState } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge, HStack, Input, VStack } from "@chakra-ui/react";
import { IChat, IUser } from "@/lib/types";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { UserListItem } from "@/components/ChatList/components/UserListItem";
import { MdClose } from "react-icons/md";
import { showError } from "@/lib/utils";
import axiosClient from "@/config/axiosConfig";
import { useDataStore } from "@/store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupChatModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const { fetchUsersBySearch, users, isLoading } = useSearchUsers();

  const addChat = useDataStore((store) => store.actions.addChat);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (obj) => !selectedUsers.some((user) => user._id === obj._id)
      ),
    [selectedUsers, users]
  );

  const handleSelectUser = (selectedUser: IUser) => {
    setSelectedUsers(selectedUsers.concat(selectedUser));
    setSearchText("");
  };

  const handleRemoveUser = (selectedUser: IUser) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== selectedUser._id)
    );
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchText("");
    setName("");

    onClose();
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      showError("Name is required");
      return;
    }
    if (selectedUsers.length < 2) {
      showError("Minimum 2 users are required");
      return;
    }

    try {
      setIsCreating(true);
      const res = await axiosClient.post<IChat>("/api/chats/group", {
        groupName: name,
        userIds: selectedUsers.map((obj) => obj._id),
      });

      addChat(res.data);
      handleClose();
    } catch (error) {
      showError(error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchUsersBySearch(searchText);
  }, [searchText]);

  return (
    <DialogRoot
      lazyMount
      open={isOpen}
      onOpenChange={(e) => !e.open && handleClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Group chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <DialogBody gap={4}>
            <VStack alignItems="flex-start">
              <Input
                name="name"
                placeholder="Group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                name="select-users"
                placeholder="Select users (minimum two)"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <HStack wrap="wrap">
                {selectedUsers.map((obj) => (
                  <Badge
                    colorPalette="purple"
                    onClick={() => handleRemoveUser(obj)}
                    cursor="pointer"
                    size="lg"
                  >
                    {obj.name} <MdClose />
                  </Badge>
                ))}
              </HStack>
              {filteredUsers.slice(0, 4).map((userObj) => (
                <UserListItem
                  user={userObj}
                  key={userObj._id}
                  onClick={handleSelectUser}
                />
              ))}
              {filteredUsers.length === 0 && searchText && !isLoading && (
                <p>No results found.</p>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" disabled={isCreating}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button type="submit" loading={isCreating} disabled={isCreating}>
              Create
            </Button>
          </DialogFooter>
        </form>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
