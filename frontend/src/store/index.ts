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
};

// create store
export const useDataStore = create<IStore & IActions>()((set, get) => ({
  ...initialState,

  reset: () => {
    set({ ...initialState, user: null });
  },

  setStoreField: (key, value) => {
    set((state) => ({
      ...state,
      [key]: value,
    }));
  },
}));
