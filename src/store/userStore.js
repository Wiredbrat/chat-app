import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout } from "../api/connection";

const useAuth = create((set, get) => ({
  user: {},
  isLoggedIn: false,
  setUser: (user) => set({ user }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  
  chatRooms: new Map(),

  removeUser: () => set({ user: {} }),
  updateUser: (payload) =>
    set((state) => ({
      user: {
        ...state.user,
        ...payload,
      },
    })),

  updateChatRooms: (rooms) =>
    set((state) => {
      const chatRooms = new Map(state.chatRooms);

      rooms.forEach((room) => {
        chatRooms.set(room._id, room);
      });

      return { chatRooms };
    }),
  
  checkAuth: async () => {
    try {
      // Backend reads the cookie automatically and returns user data if valid
      const response = await api.get("/");
      set({ user: response.data, isLoggedIn: true, isLoading: false });
    } catch (error) {
      // Cookie was missing, expired, or invalid
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },
}));

export default useAuth;
