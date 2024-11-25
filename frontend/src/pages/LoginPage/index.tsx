import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { Login } from "../../components/Login";
import { Signup } from "../../components/Signup";

export const LoginPage = () => {
  return (
    <Grid templateColumns="2fr 1fr" height={"100%"}>
      <GridItem bg="blue.500" />
      <GridItem
        display="flex"
        flexDirection="column"
        // justifyContent="center"
        gap={6}
        p={4}
        mt={10}
      >
        <Tabs.Root
          variant="enclosed"
          maxW="md"
          fitted
          defaultValue={"login"}
          colorPalette="blue"
        >
          <Tabs.List backgroundColor="#3B82F6">
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="signup">Sign up</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="login">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="signup">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </GridItem>
    </Grid>
  );
};
