import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logout } from '../api/connection';

const useAuth = create(persist((set, get) => ({
  user: {},
  isLoggedIn: false,
  setUser: (user) => set({ user }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  removeUser: () => set({ user: {} }),
  updateUser: (payload) =>
    set((state) => ({
      user: {
        ...state.user,
        ...payload,
      },
    })),
  checkAuth: async () => {
    try {
      // Backend reads the cookie automatically and returns user data if valid
      const response = await api.get('/'); 
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // Cookie was missing, expired, or invalid
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

})));

export default useAuth