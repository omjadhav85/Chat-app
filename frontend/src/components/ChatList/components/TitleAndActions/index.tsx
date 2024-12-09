import { Button } from "@/components/ui/button";
import { Heading, HStack } from "@chakra-ui/react";
import { FiMoreHorizontal } from "react-icons/fi";

export const TitleAndActions = () => {
  return (
    <HStack justifyContent="space-between">
      <Heading>Chats</Heading>
      <Button variant="ghost" borderRadius="full">
        <FiMoreHorizontal />
      </Button>
    </HStack>
  );
};
