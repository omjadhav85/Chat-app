import axiosClient from "@/config/axiosConfig";
import { USER_DATA } from "@/lib/constants";
import { IChat } from "@/lib/types";
import { showError } from "@/lib/utils";
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
  selectedChat: null,
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
    setSelectedChat: (chat) => {
      set((state) => ({
        ...state,
        selectedChat: state.selectedChat?._id === chat._id ? null : chat,
      }));
    },

    refreshUserChats: async () => {
      try {
        const res = await axiosClient.get<IChat[]>("/api/chats");

        set((state) => ({
          ...state,
          userChats: res.data || [],
        }));
      } catch (error) {
        showError(error);
      }
    },
  },
}));
