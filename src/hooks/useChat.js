import { useCallback, useMemo, useState } from 'react';
import { conversations as seed, canned } from '../data/mockData.js';
import useAuth from '../store/userStore.js';
import useSocketStore from '../store/useSocketStore.js';

let nextId = 1000;

/**
 * Owns all chat state: the conversation list, the active conversation,
 * and sending / simulated-reply logic. Kept as a single hook so the UI
 * components stay presentational and easy to test.
 */
export function useChat() {
  const [conversations, setConversations] = useState(seed);
  const [activeId, setActiveId] = useState(seed[0]?.id ?? null);
  const [typingId, setTypingId] = useState(null);
  const [query, setQuery] = useState('');
  const send = useSocketStore(state => state.sendMessage);
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const filteredConversations = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter((c) => c.name.toLowerCase().includes(q));
  }, [conversations, query]);

  const selectConversation = useCallback((id) => {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || !activeId) return;

      const messageData = {
          receiverId: "6a971871a45899e83b06974c",
          message: text,
        }

      send(messageData);

      const outgoing = { id: `m${nextId++}`, from: 'me', text: trimmed, time: 'Now' };

      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, outgoing] } : c))
      );

      // Simulate the other side responding after a short delay.
      setTypingId(activeId);
      const reply = canned[Math.floor(Math.random() * canned.length)];
      const delay = 900 + Math.random() * 900;

      setTimeout(() => {
        setTypingId((current) => (current === activeId ? null : current));
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? { ...c, messages: [...c.messages, { id: `m${nextId++}`, from: 'them', text: reply, time: 'Now' }] }
              : c
          )
        );
      }, delay);
    },
    [activeId]
  );

  return {
    conversations: filteredConversations,
    activeConversation,
    selectConversation,
    sendMessage,
    typingId,
    query,
    setQuery,
  };
}
