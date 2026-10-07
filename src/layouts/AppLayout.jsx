import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar.jsx';
import { useChat } from '../hooks/useChat.js';
import { debounce } from '../utils/utils.js';
import { getUserByUsername } from '../api/connection.js';

/**
 * The persistent shell for everything behind auth: the sidebar stays
 * mounted across route changes, and the active page (chat thread, or
 * nothing selected) renders into <Outlet /> via context so nested routes
 * can reach chat state without prop drilling.
 */
function AppLayout({ auth }) {
  const chat = useChat();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSelect = (id) => {
    chat.selectConversation(id);
    navigate(`/chat/${id}`);
  };

  const handleNewChat = async(id) => {
    chat.setQuery('');
    const newChatId = await chat.createConversation(id);
   // console.log("new chat ",newChatId)
    if(newChatId) {
      navigate(`/chat/${newChatId}`);
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <div className="app">
      <Sidebar
        conversations={chat.conversations}
        activeId={chat.activeConversation?.id}
        onSelect={handleSelect}
        query={chat.query}
        // onQueryChange={(query) => debounceSearch(query)}
        onQueryChange={chat.setQuery}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={auth.user}
        onLogout={handleLogout}
        onNewChat={handleNewChat}
      />
      <Outlet context={{ chat, openSidebar: () => setSidebarOpen(true) }} />
    </div>
  );
}

export default AppLayout;