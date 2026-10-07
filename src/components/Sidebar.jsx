import { useEffect, useState } from 'react';
import Avatar from './Avatar.jsx';
import { SearchIcon, PlusIcon, LogoutIcon } from './Icons.jsx';
import NewChatModal from './NewChatModal.jsx';
import useAuth from '../store/userStore.js';
import useChatStore from '../store/useChatStore.js';
import { getDayLabel, getLocalTime } from '../utils/utils.js';

function Sidebar({ conversations, activeId, onSelect, onQueryChange, isOpen, onClose, user, onLogout, onNewChat }) {
  const [query, setQuery] = useState();
  const [showNewChat, setShowNewChat] = useState(false);
  const {getLastMessage} = useChatStore();
  const handleQuery = (e) => {
    setQuery(e.target.value);
    onQueryChange(e.target.value);
  }

  const handleCreate = (userId) => {
    onNewChat(userId);
    setShowNewChat(false);
  };

  // useEffect(() => {
  //   conversations.sort(
  //     (a, b) => {
  //       const aLastMessage = getLastMessage(a?._id);
  //       const bLastMessage = getLastMessage(b?._id);
  //       return new Date(aLastMessage?.createdAt || aLastMessage?.timestamp) - new Date(bLastMessage?.createdAt || bLastMessage?.timestamp);
  //     }
  //   );
  // })

 // console.log("convo>>>",conversations)
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

        <button className="sidebar__new-chat" type="button" onClick={() => setShowNewChat(true)}>
          <PlusIcon size={20} />
        </button>

        <ul className="sidebar__list" style={{ listStyle: 'none', margin: 0 }}>
          {conversations?.map((c) => {
            const lastMessage = getLastMessage(c?._id);
            const date = getDayLabel(lastMessage?.createdAt || lastMessage?.timestamp);
            const stamp = date === "Today" ? getLocalTime(lastMessage?.createdAt || lastMessage?.timestamp) : date;
            return (
            <li key={c?._id}>
              {/* {console.log(c)} */}
              <button
                type="button"
                className={`conversation ${c?._id === activeId ? 'conversation--active' : ''}`}
                onClick={() => {
                  onSelect(c?._id);
                  onClose();
                }}
                aria-current={c?._id === activeId}
              >
                <Avatar initials={c?.initials} online={c?.online} />
                <span className="conversation__body">
                  <span className="conversation__top">
                    <span className="conversation__name">{c?.participants[0]?.username}</span>
                    <span className="conversation__time">{stamp || ""}</span>
                  </span>
                  <span className="conversation__preview">{ lastMessage?.message || ""}</span>
                </span>
                {c?.unread > 0 && <span className="conversation__unread">{c?.unread || ""}</span>}
              </button>
            </li>
          )})}
          {conversations.length === 0 && (
            <p style={{ color: 'var(--color-ink-faint)', padding: '12px', fontSize: 13, textAlign: "center" }}>No conversations found.</p>
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
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} onCreate={(userId) => handleCreate(userId)} />}
    </>
  );
}

export default Sidebar;
