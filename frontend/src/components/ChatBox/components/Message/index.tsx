import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { IMessage } from "@/lib/types";
import { isLoggedInUser } from "@/lib/utils";
import { Flex, Text } from "@chakra-ui/react";

interface Props {
  message: IMessage;
  showAvatar?: boolean;
}

export const Message = ({ message, showAvatar = true }: Props) => {
  const { content, sentBy } = message;

  const isLoggedInUserMsg = isLoggedInUser(sentBy);

  return (
    <Flex
      align="center"
      justify={isLoggedInUserMsg ? "flex-end" : "flex-start"}
      marginBottom={0.5}
    >
      <Flex align="center" gap="1">
        {!isLoggedInUserMsg && (
          <Tooltip content={sentBy.name}>
            <Avatar
              name={sentBy?.name}
              src={sentBy?.pic}
              size="2xs"
              order={isLoggedInUserMsg ? 2 : 0}
              visibility={showAvatar ? "visible" : "hidden"}
            />
          </Tooltip>
        )}

        <Text
          bgColor={isLoggedInUserMsg ? "#BEE3F8" : "#B9F5D0"}
          borderRadius="4xl"
          paddingX={2}
          paddingY={0.5}
        >
          {content}
        </Text>
      </Flex>
    </Flex>
  );
};
