import { IUser } from "@/lib/types";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
} from "@/components/ui/dialog";
import {
  DialogOpenChangeDetails,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

interface IProps {
  user: IUser;
  isOpen: boolean;
  onChange: (e: DialogOpenChangeDetails) => void;
}

export const UserProfileModal = ({ isOpen, user, onChange }: IProps) => {
  return (
    <DialogRoot lazyMount open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogBody mt={8}>
          <VStack>
            <Heading mb={4}>{user?.name}</Heading>
            <Image
              boxSize="150px"
              borderRadius="full"
              fit="cover"
              src={user?.pic}
              alt={user?.name}
              mb={4}
            />

            <Text fontSize="lg">Email: {user?.email}</Text>
          </VStack>
        </DialogBody>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
