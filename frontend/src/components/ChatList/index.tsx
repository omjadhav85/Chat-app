import { SearchUsers } from "@/components/ChatList/components/SearchUsers";
import { TitleAndActions } from "@/components/ChatList/components/TitleAndActions";
import { Stack } from "@chakra-ui/react";

export const ChatList = () => {
  return (
    <Stack
      flex={3}
      borderRadius="4xl"
      backgroundColor="white"
      display="flex"
      p="4"
    >
      <TitleAndActions />
      <SearchUsers />
    </Stack>
  );
};
