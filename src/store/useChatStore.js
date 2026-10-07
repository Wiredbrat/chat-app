import { create } from "zustand";

const useChatStore = create((set, get) => ({
  messages: {}, // { [conversationId]: Message[] }
  activeChat: "",
  beforeTimestamp: {}, // { [conversationId]: string }
  initialChatRendered: {}, // { [conversationId]: boolean }

  getInitialChatRendered: (chatId) => {
    return get().initialChatRendered[chatId];
  },

  setBeforeTimestamp: (chatId, timestamp) => set(
      { beforeTimestamp: { ...get().beforeTimestamp, [chatId]: timestamp } }
  ),

  getBeforeTimestamp: (chatId) => {
    return get().beforeTimestamp[chatId];
  },

  getLastMessage: (chatId) => {
    const chat = get().messages[chatId];
    return chat?.[chat?.length - 1 || 0];
  },

  setActiveChat: (chatId) => set({ activeChat: chatId }),

  addPreviousMessages: (conversationId, message) =>
    set((state) => {
      const messageBucket = state.messages[conversationId] ?? [];
      const prevMessages = Array.isArray(message) ? message : [message];

      const oldestMsg = Array.isArray(prevMessages[0]?.messages)
        ? prevMessages[0]?.messages[0]
        : prevMessages[0];

      const beforeCursor = oldestMsg?.createdAt || '';

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...prevMessages, ...messageBucket],
        },
        initialChatRendered: {
          ...state.initialChatRendered,
          [conversationId]: true,
        },
        beforeTimestamp: {
          ...state.beforeTimestamp,
          [conversationId]: beforeCursor,
        },
      };
    }),

  addMessage: (conversationId, message) =>
    set((state) => {
      const currentMessages = state.messages[conversationId] ?? [];

      // Check if the message already exists by its unique ID
      const isDuplicate = currentMessages.some((m) => m?._id === message?._id);

      if (isDuplicate) {
        return state; // Returning state unmodified prevents a re-render
      }

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...currentMessages, message],
        },
      };
    }),

  replaceMessage: (conversationId, tempId, realMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: state.messages[conversationId].map((m) =>
          m.id === tempId ? { ...realMessage, status: "sent" } : m,
        ),
      },
    })),

  markFailed: (conversationId, tempId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: state.messages[conversationId].map((m) =>
          m.id === tempId ? { ...m, status: "failed" } : m,
        ),
      },
    })),
}));

export default useChatStore;
