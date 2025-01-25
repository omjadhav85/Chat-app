import { toaster } from "@/components/ui/toaster";
import { IChat, IMessage, IUser } from "@/lib/types";
import { useDataStore } from "@/store";

export const showError = (err: any) => {
  toaster.create({
    title:
      err?.response?.data?.message ||
      (typeof err === "string" ? err : "Something went wrong"),
    type: "error",
  });
};

export const getChatName = (chat: IChat) => {
  if (chat.isGroupChat) return chat.name;

  const store = useDataStore.getState();
  const { user } = store;

  return chat.users.find((u) => u._id !== user?._id)?.name;
};

export const isLoggedInUser = (userObj: IUser) => {
  const store = useDataStore.getState();
  const { user } = store;
  return userObj._id === user?._id;
};

export const hasSentByChanged = (currentMsg: IMessage, prevMsg: IMessage) => {
  if (!prevMsg) return true;

  return currentMsg.sentBy._id !== prevMsg.sentBy._id;
};

export const getOtherChatUser = (chat: IChat) => {
  const store = useDataStore.getState();
  const { user } = store;

  return chat.users.find((u) => u._id !== user?._id);
};
