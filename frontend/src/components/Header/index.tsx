import { UserOptions } from "@/components/Header/UserOptions";
import { Box, Heading } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap="1rem"
      p="0.5rem"
    >
      <Heading>Chattify</Heading>
      <UserOptions />
    </Box>
  );
};
