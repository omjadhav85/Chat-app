import { Box, Grid, GridItem, Heading, Image, Tabs } from "@chakra-ui/react";
import { Login } from "../../components/Login";
import { Signup } from "../../components/Signup";
import { useEffect } from "react";
import { USER_DATA } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-img.svg";

export const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem(USER_DATA);

    if (userData) navigate("/chats");
  }, []);
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "2fr 1fr",
      }}
      height={"100%"}
    >
      <GridItem
        display="none"
        md={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: "2rem",
          gap: 2,
        }}
        bg={"#3B82F6"}
      >
        <Heading
          fontSize="80px"
          fontFamily="Dancing Script"
          color="white"
          mb={4}
          lineHeight="inherit"
        >
          Chattify
        </Heading>
        <Box w={"70%"} h={"70%"}>
          <Image src={heroImg} alt="Hero img" fit="contain" h="full" w="full" />
        </Box>
      </GridItem>
      <GridItem display="flex" flexDirection="column" gap={6} p={4} pt={10}>
        <Heading
          fontSize="4xl"
          fontFamily="Dancing Script"
          textAlign="center"
          md={{ display: "none" }}
        >
          Chattify
        </Heading>
        <Tabs.Root
          variant="enclosed"
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
