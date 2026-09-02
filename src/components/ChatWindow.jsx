import { useEffect, useRef } from 'react';
import Avatar from './Avatar.jsx';
import MessageBubble from './MessageBubble.jsx';
import Composer from './Composer.jsx';
import { MenuIcon } from './Icons.jsx';

function ChatWindow({ conversation, isTyping, onSend, onOpenSidebar }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages.length, isTyping]);

  if (!conversation) {
    return (
      <div className="chat">
        <div className="empty-state">
          <h2>No conversation selected</h2>
          <p>Pick a conversation from the list to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <header className="chat__header">
        <button className="chat__header-menu" onClick={onOpenSidebar} aria-label="Open conversation list">
          <MenuIcon />
        </button>
        <Avatar initials={conversation.initials} online={conversation.online} />
        <div className="chat__header-info">
          <div className="chat__header-name">{conversation.name}</div>
          <div className="chat__header-status" style={{ color: conversation.online ? undefined : 'var(--color-ink-faint)' }}>
            {conversation.online ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>

      <div className="chat__messages" ref={scrollRef}>
        <div className="chat__day-divider">Today</div>
        {conversation.messages.map((m, i) => {
          const prev = conversation.messages[i - 1];
          const showAvatar = m.from !== 'me' && (!prev || prev.from !== m.from);
          return <MessageBubble key={m.id} message={m} initials={conversation.initials} showAvatar={showAvatar} />;
        })}
        {isTyping && (
          <div className="msg-row msg-row--in">
            <Avatar initials={conversation.initials} size={26} />
            <div className="bubble">
              <span className="typing-indicator">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      <Composer onSend={onSend} />
    </div>
  );
}

export default ChatWindow;
