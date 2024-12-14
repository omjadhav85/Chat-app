import { Avatar } from "@/components/ui/avatar";
import { IUser } from "@/lib/types";
import { Flex, Heading, Separator, Text, VStack } from "@chakra-ui/react";
import React from "react";

interface Props {
  user: IUser;
  onClick: (userObj: IUser) => void;
}

export const UserListItem = ({ user, onClick }: Props) => {
  return (
    <Flex
      alignItems="center"
      gap={2}
      borderRadius="lg"
      //   justifyContent="flex-start"
      bg="#F3F6FF"
      p={2}
      w={"full"}
      cursor="pointer"
      _hover={{
        bg: "#dfe7ff",
      }}
      onClick={() => onClick(user)}
    >
      <Avatar name={user?.name} src={user?.pic} />
      <VStack justifyContent="space-between" alignItems="flex-start">
        <Heading size="sm">{user.name}</Heading>
        <Text>
          <b>Email:</b> {user.email}
        </Text>
      </VStack>
    </Flex>
  );
};
