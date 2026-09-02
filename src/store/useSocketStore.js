import { create } from "zustand";

const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  setSocket: (socket) => set({ socket }),
  setIsConnected: (isConnected) => set({isConnected}),

  sendMessage: (data) => {
    const socket = get().socket;

    if(socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'send_message',
        data: {
          receiverId: data?.receiverId,
          message: data?.message,
          timestamp: new Date()
        }
      }));
    }
  },

}))

export default useSocketStore;