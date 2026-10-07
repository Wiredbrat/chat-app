import { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow.jsx';

/**
 * Handles both "/" (no conversation picked yet — falls back to whatever
 * useChat's default active conversation is) and "/chat/:conversationId"
 * (selects that conversation on mount / when the param changes).
 */
function ChatRoute() {
  const { chat, openSidebar } = useOutletContext();
  const { conversationId } = useParams();

  useEffect(() => {
    if (conversationId) chat.selectConversation(conversationId);
  }, [conversationId]);

  return (
    <ChatWindow
      conversation={chat.activeConversation}
      isTyping={chat.typingId === chat.activeConversation?.id}
      onSend={chat.sendMessage}
      onOpenSidebar={openSidebar}
    />
  );
}

export default ChatRoute;