import { create } from "zustand";

const useOnlineStore = create((set, get) => ({
  onlineUsers: new Map(),
  getOnlineUsers: (userId) => get().onlineUsers.get(userId),
  addOnlineUser: (userId) =>
    set((state) => ({ onlineUsers: state.onlineUsers.set(userId, true) })),
  removeOnlineUser: (userId) =>
    set((state) => ({ onlineUsers: state.onlineUsers.set(userId, false) })),
}));

export default useOnlineStore;
