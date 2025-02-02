import { NotificationBell } from "@/components/Header/NotificationBell";
import { UserOptions } from "@/components/Header/UserOptions";
import { Box, Flex, Heading } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap="1rem"
      p="0.5rem"
    >
      <Heading fontFamily="Dancing Script" fontSize="4xl" lineHeight="inherit">
        Chattify
      </Heading>
      <Flex gap={2} align="center">
        <NotificationBell />
        <UserOptions />
      </Flex>
    </Box>
  );
};
