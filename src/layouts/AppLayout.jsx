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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = (id) => {
    chat.selectConversation(id);
    navigate(`/chat/${id}`);
  };


  const handleSearch = async (query) => {
    try { 
      const res = await getUserByUsername(query);
      console.log(res); 
    } catch (error) {
      
    }
  }

  const handleLogout = () => {
    auth.logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  const debounceSearch = debounce(handleSearch , 1500)
  return (
    <div className="app">
      <Sidebar
        conversations={chat.conversations}
        activeId={chat.activeConversation?.id}
        onSelect={handleSelect}
        onQueryChange={(query) => debounceSearch(query)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={auth.user}
        onLogout={handleLogout}
      />
      <Outlet context={{ chat, openSidebar: () => setSidebarOpen(true) }} />
    </div>
  );
}

export default AppLayout;