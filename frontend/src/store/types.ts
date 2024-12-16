import { IChat, IUser } from "@/lib/types";

// define types for state values and actions separately
export interface IStore {
  user: IUser | null;
  userChats: IChat[];
}

export interface IActions {
  actions: {
    reset: () => void;
    setStoreField: <K extends keyof IStore>(key: K, value: IStore[K]) => void;
    addChat: (newChat: IChat) => void;
  };
}
