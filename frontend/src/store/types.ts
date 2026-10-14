import { IChat, IMessage, IUser } from "@/lib/types";

// define types for state values and actions separately
export interface IStore {
  user: IUser | null;
  userChats: IChat[];
  selectedChat: IChat | null;
  isSocketConnected: boolean;
  notifications: IMessage[];
}

export interface IActions {
  actions: {
    reset: () => void;
    setStoreField: <K extends keyof IStore>(key: K, value: IStore[K]) => void;
    upsertChat: (chat: IChat) => void;
    removeChat: (chatId: string) => void;
    applyIncomingMsg: (msg: IMessage) => void;
    setSelectedChat: (chat: IChat) => void;
    refreshUserChats: () => Promise<void>;
  };
}
