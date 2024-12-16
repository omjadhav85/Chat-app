import { USER_DATA } from "@/lib/constants";
import { IActions, IStore } from "@/store/types";
import { create } from "zustand";

const getInitialUserState = () => {
  const lsData = localStorage.getItem(USER_DATA);

  return lsData ? JSON.parse(lsData) : null;
};

// define the initial state
const initialState: IStore = {
  user: getInitialUserState(),
  userChats: [],
};

// create store
export const useDataStore = create<IStore & IActions>()((set, get) => ({
  ...initialState,
  actions: {
    reset: () => {
      set({ ...initialState, user: null });
    },

    setStoreField: (key, value) => {
      set((state) => ({
        ...state,
        [key]: value,
      }));
    },

    addChat: (newChat) => {
      set((state) => ({
        ...state,
        userChats: [newChat, ...state.userChats],
      }));
    },
  },
}));
