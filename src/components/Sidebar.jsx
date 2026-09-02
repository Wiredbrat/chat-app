import { useState } from 'react';
import Avatar from './Avatar.jsx';
import { SearchIcon, PlusIcon, LogoutIcon } from './Icons.jsx';

function Sidebar({ conversations, activeId, onSelect, onQueryChange, isOpen, onClose, user, onLogout }) {
  const [query, setQuery] = useState();
  const handleQuery = (e) => {
    setQuery(e.target.value);
    onQueryChange(e.target.value);
  }

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Conversations">
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <span className="sidebar__brand-mark">N</span>
            Nimbus
          </div>
          <label className="sidebar__search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search conversations"
              value={query}
              onChange={(e) => handleQuery(e)}
              aria-label="Search conversations"
            />
          </label>
        </div>

        <button className="sidebar__new-chat" type="button">
          <PlusIcon /> New chat
        </button>

        <ul className="sidebar__list" style={{ listStyle: 'none', margin: 0 }}>
          {conversations.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`conversation ${c.id === activeId ? 'conversation--active' : ''}`}
                onClick={() => {
                  onSelect(c.id);
                  onClose();
                }}
                aria-current={c.id === activeId}
              >
                <Avatar initials={c.initials} online={c.online} />
                <span className="conversation__body">
                  <span className="conversation__top">
                    <span className="conversation__name">{c.name}</span>
                    <span className="conversation__time">{c.messages.at(-1)?.time}</span>
                  </span>
                  <span className="conversation__preview">{c.messages.at(-1)?.text}</span>
                </span>
                {c.unread > 0 && <span className="conversation__unread">{c.unread}</span>}
              </button>
            </li>
          ))}
          {conversations.length === 0 && (
            <p style={{ color: 'var(--color-ink-faint)', padding: '12px', fontSize: 13 }}>No conversations found.</p>
          )}
        </ul>

        {user && (
          <div className="sidebar__footer">
            <Avatar initials={user.initials} size={34} />
            <span className="sidebar__footer-info">
              <span className="sidebar__footer-name">{user.name}</span>
              <span className="sidebar__footer-email">{user.email}</span>
            </span>
            <button type="button" className="sidebar__logout" onClick={onLogout} aria-label="Log out">
              <LogoutIcon />
            </button>
          </div>
        )}
      </aside>
      <div className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--open' : ''}`} onClick={onClose} />
    </>
  );
}

export default Sidebar;
