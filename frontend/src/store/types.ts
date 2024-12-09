import { IUser } from "@/lib/types";

// define types for state values and actions separately
export interface IStore {
  user: IUser | null;
}

export interface IActions {
  reset: () => void;
  setStoreField: <K extends keyof IStore>(key: K, value: IStore[K]) => void;
}
