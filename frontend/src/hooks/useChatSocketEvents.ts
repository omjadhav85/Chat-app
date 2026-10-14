import { socket } from "@/config/socketConfig";
import { IChat, IMessage } from "@/lib/types";
import { useDataStore } from "@/store";
import { useEffect } from "react";

// Keeps the chat list and notifications in sync with server events.
// Mount once (in ChatsPage); the open conversation's messages are handled
// separately in SingleChat.
export const useChatSocketEvents = () => {
  useEffect(() => {
    // Read the store at event time so handlers never use stale state
    const { actions } = useDataStore.getState();

    // A chat was created or changed (members, name) and we're a member
    const handleChatUpdated = (chat: IChat) => actions.upsertChat(chat);

    // We were removed from a group
    const handleChatRemoved = (chatId: string) => actions.removeChat(chatId);

    const handleReceiveMsg = (msg: IMessage) => {
      actions.applyIncomingMsg(msg);

      // Only notify for chats that aren't currently open
      const { selectedChat, notifications } = useDataStore.getState();
      if (selectedChat?._id !== msg.chatId._id) {
        actions.setStoreField("notifications", [...notifications, msg]);
      }
    };

    socket.on("chat updated", handleChatUpdated);
    socket.on("chat removed", handleChatRemoved);
    socket.on("receive msg", handleReceiveMsg);

    return () => {
      socket.off("chat updated", handleChatUpdated);
      socket.off("chat removed", handleChatRemoved);
      socket.off("receive msg", handleReceiveMsg);
    };
  }, []);
};
