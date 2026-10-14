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
  isSocketConnected: false,
  notifications: [],
};

// create store
export const useDataStore = create<IStore & IActions>()((set) => ({
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

    // Adds the chat at the top, or replaces it if it's already in the list.
    // Safe to call repeatedly with the same chat (e.g. API response + socket)
    upsertChat: (chat) => {
      set((state) => {
        const exists = state.userChats.some((c) => c._id === chat._id);

        return {
          userChats: exists
            ? state.userChats.map((c) => (c._id === chat._id ? chat : c))
            : [chat, ...state.userChats],
          // keep the open chat in sync (e.g. renamed group, new members)
          selectedChat:
            state.selectedChat?._id === chat._id ? chat : state.selectedChat,
        };
      });
    },

    // Drops a chat the user no longer has access to (e.g. removed from group)
    removeChat: (chatId) => {
      set((state) => ({
        userChats: state.userChats.filter((c) => c._id !== chatId),
        selectedChat:
          state.selectedChat?._id === chatId ? null : state.selectedChat,
        notifications: state.notifications.filter(
          (m) => m.chatId._id !== chatId
        ),
      }));
    },

    // Updates the chat's latest message preview and moves it to the top
    applyIncomingMsg: (msg) => {
      set((state) => {
        const existing = state.userChats.find((c) => c._id === msg.chatId._id);
        // Fall back to the chat sent along with the message if it isn't
        // in the list yet
        const updatedChat = {
          ...(existing ?? msg.chatId),
          latestMsg: msg,
          updatedAt: msg.createdAt,
        };

        return {
          userChats: [
            updatedChat,
            ...state.userChats.filter((c) => c._id !== msg.chatId._id),
          ],
        };
      });
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
