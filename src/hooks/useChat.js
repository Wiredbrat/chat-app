import { useCallback, useEffect, useMemo, useState } from 'react';
import { conversations as seed, canned } from '../data/mockData.js';
import { createNewChatRoom, getConversations, getUser } from '../api/connection.js';
import toast from 'react-hot-toast';
import useAuth from '../store/userStore.js';
import useSocketStore from '../store/useSocketStore.js';
import useChatStore from '../store/useChatStore.js';
import { generateUUID } from '../utils/utils.js';

let nextId = 1000;
let nextConvoId = 100;

/** Derive up-to-2-letter initials from a display name, e.g. "Sam Lee" -> "SL". */
function initialsFromName(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const letters = parts.slice(0, 2).map((p) => p[0].toUpperCase());
  return letters.join('');
}

/**
 * Owns all chat state: the conversation list, the active conversation,
 * and sending / simulated-reply logic. Kept as a single hook so the UI
 * components stay presentational and easy to test.
 */
export function useChat() {
  const { updateUser, user, chatRooms, updateChatRooms } = useAuth();
  const { messages, addMessage } = useChatStore();
  const [conversations, setConversations] = useState([...chatRooms.values()]);
  const [newConversation, setNewConversation] = useState({});
  const [typingId, setTypingId] = useState(null);
  const [query, setQuery] = useState('');
  const { sendClientMessage } = useSocketStore();
  const { activeChat, setActiveChat } = useChatStore();

  const activeConversation = useMemo(
    () => conversations.find((c) => c?._id === activeChat) ?? null,
    [conversations, activeChat]
  );

  //// console.log("Active convo>>>", activeConversation)

  const chatList = async () => {
    let chats = null;
    try {
      chats = await getConversations();
      if (chats.success) {
        updateChatRooms(chats.data);
        setConversations(chats.data);
      }
    } catch (error) {
     // console.log(error)
      // toast.error(chats.message|| error.message)
    }
  }

  useEffect(() => {
    chatList()
  }, []);

  const filteredConversations = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
   // console.log(conversations)
    return conversations.filter((c) => c.participants[0].username?.toLowerCase().includes(q));
  }, [conversations, query]);

  const newConversationData = async (receiverId) => {
    try {
      const response = await createNewChatRoom(receiverId);
      // console.log(response)
      if (response.success) {
        setNewConversation(response.data);
        setConversations(conversations => [...conversations, response.data]);
        chatRooms.set(response?.data?._id, response.data);
        addMessage(response?.data?._id, []);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  }

  const createConversation = useCallback(
    async (id) => {
      const userId = id;
      if (!userId) return null;

      // Room already exists (case-insensitive match) — just switch to it
      const existing = conversations.find((c) => c?.participants[0]?._id === userId);
     // console.log("existingchat", existing)

      if (existing) {
        setActiveChat(existing?._id);
        return existing._id;
      }

      try {
        const receiverId = id;

        const newConversation = await newConversationData(receiverId);
        if (newConversation.success) {
          setConversations((prev) => [newConversation, ...prev]);
          setActiveChat(activeConversation?._id);
          return id;
        }
      } catch (error) {
       // console.log(newConversation)
        toast.error(error.message)
      }
    },
    [conversations]
  );

  const selectConversation = useCallback((id) => {
    setActiveChat(id);
    setConversations((prev) => prev?.map((c) => (c?._id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const sendMessage = useCallback((text) => {
    const trimmed = text;
    if (!trimmed || !activeChat) return;

    const data = {
      _id: generateUUID(),
      roomId: activeConversation?._id,
      receiverId: activeConversation?.participants[0]?._id,
      message: text,
      timestamp: new Date().toISOString(),
      type: "Outgoing"
    }

   // console.log("Active Conversation>>>>", activeConversation);
    addMessage(activeConversation?._id, data);
   // console.log(data)
    sendClientMessage(data);

    // Simulate the other side responding after a short delay.
    setTypingId(activeChat);
    const reply = canned[Math.floor(Math.random() * canned.length)];
    const delay = 900 + Math.random() * 900;

    setTypingId((current) => (current === activeChat ? null : current));
    setConversations((prev) =>
      prev.map((c) =>
        c?.id === activeChat
          ? { ...c, messages: [...c.messages, { id: `m${nextId++}`, from: 'them', text: reply, time: 'Now' }] }
          : c
      )
    );
  },
    [activeChat]
  );

  return {
    conversations: filteredConversations,
    activeConversation,
    selectConversation,
    createConversation,
    sendMessage,
    typingId,
    query,
    setQuery,
  };
}
