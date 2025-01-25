import { toaster } from "@/components/ui/toaster";
import { IChat } from "@/lib/types";
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
